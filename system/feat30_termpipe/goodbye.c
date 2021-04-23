#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<fcntl.h>
#include<unistd.h>

int main() {
    char buf[50];
    memset(buf, 0, sizeof buf);

    int fd = fileno(stdin);
    int flags = fcntl(fd, F_GETFL, 0);
    fcntl(fd, F_SETFL, flags | O_NONBLOCK);

    int nRead;
    nRead = read(fd, buf, sizeof buf - 1);
    if (nRead < 0) {
        printf("no immediate input\n");
    } else {
        buf[nRead] = '\0';
        printf("%s\n", buf);
    }

    fcntl(fd , F_SETFL, flags);
    while (1) {
        nRead = read(fd, buf, sizeof buf - 1);
        if (nRead < 0) {
            printf("read -1 bytes\n");
            exit(1);
        }
        if (nRead == 0) {
            printf("pipe closed (read 0 bytes)\n");
            exit(1);
        }
        buf[nRead] = '\0';
        printf("%d: %s\n", nRead, buf);
    }

}

