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
#include<sys/times.h>

void doWork1(long N) {
    unsigned int c;
    for (long i = 0; i < N; i++) {
        c += c << 5 + 8*c;
    }
    printf("%d\n", c);
}

void doWork2(int N) {
    for (int i = 0; i < N; i++) {
        printf("a");
    }
    printf("\n");
}

int main(int argc, char** argv) {

    struct timespec t0, t1;
    clock_t start, end;

    if (clock_gettime(CLOCK_REALTIME, &t0) < 0) {
        perror(NULL);
        exit(1);
    }
    start = clock();

    long N = (long) 1 << 31;
    doWork1(N);
    //doWork2(10000000);

    end = clock();
    if (clock_gettime(CLOCK_REALTIME, &t1) < 0) {
        perror(NULL);
        exit(1);
    }

    struct tms buf;
    times(&buf);

    time_t elapsed_real_ns = t1.tv_nsec - t0.tv_nsec + 1000000000 * (t1.tv_sec - t0.tv_sec);
    time_t elapsed_cpu_ns = (1000000000 * (end - start)) / CLOCKS_PER_SEC;
    printf("Realtime: %.3fms\nCPU: %.3fms\n", (double) elapsed_real_ns / 1000000, (double) elapsed_cpu_ns / 1000000);

    printf("%ld, %ld, %ld, %ld\n", buf.tms_utime, buf.tms_stime, buf.tms_cutime, buf.tms_cstime);

    return 0;
}

