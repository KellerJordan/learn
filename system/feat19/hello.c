#include<stdio.h>
#include<stdlib.h>
#include<malloc.h>
#include<string.h>
#include<unistd.h>
#include<fcntl.h>
#include<string.h>

void listen_fd(int fd) {
    FILE* output = fdopen(fd, "r");
    char c;
    while ((c = fgetc(output)) != EOF) {
        putc(c, stderr);
    }
    fclose(output);
}

int main(int argc, char** argv) {
    /*
    int mypipe[2];
    if (pipe(mypipe) < 0) {
        perror(NULL);
        exit(1);
    }
    if (fork() == 0) {
        close(mypipe[1]);
        listen_fd(mypipe[0]);
        exit(0);
    }
    */
    /*
    if (fork() == 0) {
        listen_fd(STDIN_FILENO);
        exit(0);
    }
    */
    //dup2(STDOUT_FILENO, mypipe[0]);
    //dup2(mypipe[0], STDOUT_FILENO);

    //close(mypipe[0]);
    //dup2(mypipe[1], STDIN_FILENO);
    /*
    FILE* input = fdopen(mypipe[1], "w");
    fwrite("test string\n", 1, 13, input);
    fclose(input);
    */

    //printf("%d\n", STDIN_FILENO);
    //fwrite("my string\n", 1, 11, stdin);
    char buf[500];
    int nRead;
    /*
    nRead = fread(&buf, 1, 10, stdin);
    printf("%d %s\n", nRead, buf);
    */

    
    printf("test string\n");
    nRead = fread(&buf, 1, 100, stdout);
    printf("%d %s\n", nRead, buf);

    /*
    close(STDOUT_FILENO);
    system("ls");
    */
    //printf("test\n");

    /*
    FILE* output = popen("ls", "r");
    if (!output) {
        perror(NULL);
        exit(1);
    }
    */


    return 0;
}

