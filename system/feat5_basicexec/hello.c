#include<stdio.h>
#include<unistd.h>
#include<fcntl.h>
#include<errno.h>
#include<stdlib.h>
#include<string.h>
#include<wait.h>

int main() {

    pid_t pid = fork();
    if (pid == 0) {
        char* argv[2];
        argv[0] = "pyhello.py";
        argv[1] = NULL;
        execv("pyhello.py", argv);
    }
    int status;
    pid_t pid_res = waitpid(pid, &status, 0);
    printf("status=%d\n", status);
    printf("WIFEXITED=%d, WEXITSTATUS=%d, WIFSIGNALED=%d, WTERMSIG=%d, WCOREDUMP=%d, WIFSTOPPED=%d, WSTOPSIG=%d\n",
            WIFEXITED(status), WEXITSTATUS(status), WIFSIGNALED(status), WTERMSIG(status), WCOREDUMP(status), WIFSTOPPED(status), WSTOPSIG(status));

    return 0;
}

