#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<fcntl.h>
#include<unistd.h>

int busywork(int N) {
    int i;
    int k = 782;
    for (i = 0; i < N; i++) {
        k = k * 7;
        k = k % 7102935;
    }
    return k;
}

int main() {
    int k = busywork(1000000);
    char buf[50];
    sprintf(buf, "hello %d world\n", k);
    int fd = fileno(stdout);
    write(fd, buf, strlen(buf));
    sleep(1);
    sprintf(buf, "how bout this\n");
    write(fd, buf, strlen(buf));
    sprintf(buf, "second heree\n");
    write(fd, buf, strlen(buf));
    sleep(1);
    sprintf(buf, "nexttnextnextnext\n");
    write(fd, buf, strlen(buf));
    sleep(1);
    sprintf(buf, "finally\n");
    write(fd, buf, strlen(buf));
}

