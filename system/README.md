## Stresstest results:

Number of processes before windows freezes: a few thousand.
Time for a process context-switch: about 0.6ms.
Time to replace current process using `system` call: about 6ms.

## How file descriptors work
For the C program, a file descriptor is simply an integer. The meat of the structure is hidden, accessible only to the OS. I/O in C is mostly done with "streams", which are an abstraction on top of the low-level I/O interface on file descriptors, designed to reduce the number of syscalls via application-side buffering of I/O. When a process creates a child process, its file descriptors (i.e., the structures in kernel memory associated to the process) are copied over. E.g. this is why child processes use the same stdin and stdout as the parent. The only function I am aware of which modifies an FD, rather than creating a new one or doing I/O with one, is `dup2`. This copies the (kernel-side) FD of the first argument into the second. It does not affect the file descriptors in parent process.

## How pipes work
The `pipe` call creates two file descriptors, which serve as access points to a FIFO data structure in the kernel. Writes into the second FD can be read-out by reads to the first in a FIFO manner. There is no notion of separate writes generating separate packets of data -- two successive calls to write() by one process can be read out with a single read() by another. Calls to read() are blocking, and it will be pseudo-random which process gets unblocked and reads written data. When a process calls write(), but there is no other process which still has the read-end FD of the pipe open (including possible `dup2`'d FDs), this will generate a signal which by default crashes the program. When a process calls read(), but there is no other process which still has the write-end FD of the pipe open, then it will immediately return zero and not read anything into the buffer.

Thus, we can see that to support pipes, the OS must implement 1. a FIFO inter-process data structure 2. a way to track which processes have which parts of the pipe open -- i.e. to track which processes have an FD open which points to the kernel-side structure. (or multiple FD's with `dup` or `dup2`).

# Information associated with a process

- The current working directory.
- Open file descriptors (although this is partially something which is not attached to any one process, e.g. for a `dup`'d FD the OS maintains state independent of any proc. Per-proc it just maintains info about who has it open)
- Parent-child relationships to other processes, so that `wait` calls can be served properly.
- I suppose: it might in theory track which tty started the proc. Or this could just be controlled by the stdin and stdout (streams on) FDs. Well, at least the tty must track what is the current active process, so that ctrl-C can be sent properly.
- Maybe something about "process group"?

# Comments
- It seems to me that I/O streams cannot be "purely an abstraction layer". If they were purely user-space abstractions, then how would the streams always know to flush their contents before the main function returns?
- Followup to the above: it appears that indeed, when the program is ended by a call to `_exit` (as opposed to `exit`), streams do not always get flushed. It is obvious how streams could be purely a user-space abstraction if flushing only happens on calls to `exit`. But what I still don't understand, is how this flushing could automatically take place when the program is ended by a `return` statement in `main`.

