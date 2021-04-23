#include<stdio.h>
#include<stdlib.h>
#include<unistd.h>

void listen_fd(int fd) {
    FILE* output = fdopen(fd, "r");
    char c;
    while ((c = fgetc(output)) != EOF) {
        putc(c, stderr);
    }
    fclose(output);
}

int main(int argc, char** argv) {

    // feed stdout into the pipe
    int fd_out = dup(fileno(stdout));
    int pipefd[2];
    pipe(pipefd);
    dup2(pipefd[1], fileno(stdout));
    if (fork() == 0) {
        close(pipefd[0]);
        printf("testZ");
        close(pipefd[1]);
        exit(0);
    }
    // restore stdout
    dup2(fd_out, fileno(stdout));
    // read what was written into the pipe
    char buf[11] = "aaaaaaaaa\n";
    printf("reading...\n");
    int nRead = read(pipefd[0], buf, 50);
    printf("%d %s", nRead, buf);
    printf("\n==============\n");
    for (int i = 0; i < 11; i++) {
        printf("%d\n", (int) buf[i]);
    }



    return 0;
}

