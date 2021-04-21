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
#include<sys/time.h>

int main(int argc, char** argv) {

    struct timespec ts = {
        .tv_sec = 31536000,
        .tv_nsec = 0,
    };
    if (clock_settime(CLOCK_REALTIME, &ts) < 0) {
        fprintf(stderr, "got error in clock_settime\n");
        perror(NULL);
    }

    struct timeval tv = {
        .tv_sec = 31536000,
        .tv_usec = 0,
    };
    if (settimeofday(&tv, NULL) < 0) {
        fprintf(stderr, "got error in settimeofday\n");
        perror(NULL);
    }

    return 0;
}

