#include<stdio.h>
#include<unistd.h>
#include<fcntl.h>
#include<errno.h>
#include<stdlib.h>
#include<string.h>
#include<wait.h>
#include<sys/mman.h>
#include<sys/stat.h>

int main() {

    int num_lines = 100;
    size_t file_size = 15*num_lines;
    printf("writing %ld bytes\n", file_size);

    int fd = open("data.txt", O_RDWR | O_CREAT | O_TRUNC, 0777);
    if (fd == -1) {
        perror(NULL);
        exit(1);
    }

    off_t res = lseek(fd, (off_t) file_size-1, SEEK_SET);
    if (res < 0) {
        perror(NULL);
        exit(1);
    }
    if (write(fd, "\0", 1) != 1) {
        perror(NULL);
        exit(1);
    }

    if (fsync(fd) < 0) {
        perror(NULL);
        exit(1);
    }

    char* ptr = mmap(NULL, file_size, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (ptr == (caddr_t) -1) {
        perror(NULL);
        exit(1);
    }

    int i;
    for (i = 0; i < num_lines; i++) {
        strcpy(ptr+15*i, "does this work\n");
    }

    return 0;
}

