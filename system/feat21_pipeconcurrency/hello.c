#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<unistd.h>
#include<fcntl.h>
#include<string.h>
#include<limits.h>

int main(int argc, char** argv) {
    int mypipe[2];
    pipe(mypipe);

    // child 1: writes to the pipe
    if (fork() == 0) {
        close(mypipe[0]);
        printf("1 will write A\n");
        write(mypipe[1], "testA", 5);
        printf("1 did write A\n");
        // if this sleep is not present, then child 2 may read both at once.
        // i.e., two writes to a pipe may be pulled off by one read.
        sleep(1);
        printf("1 will write B\n");
        write(mypipe[1], "testB", 5);
        printf("1 did write B\n");
        exit(0);
    }

    // child 2: reads from the pipe
    if (fork() == 0) {
        close(mypipe[1]);
        printf("2 will read\n");
        char buf[51];
        int nRead = read(mypipe[0], buf, 50);
        buf[nRead] = '\0';
        printf("2 did read: %s\n", buf);
        exit(0);
    }

    // child 3: reads from the pipe
    if (fork() == 0) {
        close(mypipe[1]);
        printf("3 will read\n");
        char buf[51];
        int nRead = read(mypipe[0], buf, 50);
        printf("3 did read %d\n", nRead);
        buf[nRead] = '\0';
        printf("3 did read: %s\n", buf);
        exit(0);
    }

    close(mypipe[0]);
    close(mypipe[1]);

    wait(NULL);
    printf("1 done\n");
    wait(NULL);
    printf("2 done\n");
    wait(NULL);
    printf("3 done\n");

    return 0;
}

