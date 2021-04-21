#include<stdio.h>
#include<unistd.h>
#include<fcntl.h>
#include<errno.h>
#include<stdlib.h>
#include<string.h>
#include<wait.h>
#include<sys/mman.h>
#include<sys/stat.h>
#include<time.h>

int main(int argc, char** argv) {

    if (argc != 2) {
        printf("need argc=2\n");
        exit(1);
    }

    int reps = atoi(argv[1]);
    if (reps <= 0) {
        printf("reached bottom\n");
        exit(0);
    }


    char cmd[20];
    sprintf(cmd, "./main %d", reps-1);
    system(cmd);

    return 0;
}

