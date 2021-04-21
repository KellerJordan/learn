#include<stdio.h>
#include<stdlib.h>
#include<malloc.h>
#include<string.h>
#include<unistd.h>
#include<fcntl.h>
#include<string.h>
#include<limits.h>
#include<wait.h>
#include<time.h>

// the parent process will emit a pipe-write to child processes every PERIOD seconds.
// this will be repeated for DURATION total seconds.
#define PERIOD 0.0002
#define DURATION 1.0
#define REPETITIONS ((int) (DURATION/PERIOD))

int main(int argc, char** argv) {
    int nChild = 2;
    int childPid[nChild];

    int mypipe[2];
    pipe(mypipe);
    FILE* output = fdopen(mypipe[0], "r");

    int outpipe[2];
    pipe(outpipe);

    for (int i = 0; i < nChild; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            close(mypipe[1]);
            close(outpipe[0]);
            char c;
            while ((c = fgetc(output)) != EOF) {
                char buf[50];
                sprintf(buf, "%d", i);
                write(outpipe[1], &buf, 1);
                //putchar(buf[0]);
                //fflush(stdout);
            }
            exit(0);
        } else {
            childPid[i] = pid;
        }
    }
    fclose(output);
    close(outpipe[1]);

    struct timespec ts = { 0.0, PERIOD * 1e9 };
    for (int i = 0; i < REPETITIONS; i++) {
        write(mypipe[1], "a", 1);
        nanosleep(&ts, NULL);
    }
    //printf("\nclosing input pipe\n");
    nanosleep(&ts, NULL);
    close(mypipe[1]);

    for (int i = 0; i < nChild; i++) {
        waitpid(childPid[i], NULL, 0);
        //printf("%d done\n", i);
    }

    // read from outpipe
    char buf[REPETITIONS+1];
    buf[sizeof buf] = '\0';
    int nRead = read(outpipe[0], buf, sizeof buf);
    printf("%s\n", buf);

    return 0;
}

