#include<stdio.h>
#include<unistd.h>
#include<stdlib.h>

int main(int argc, char** argv) {

    if (fork() == 0) {
        for (int i = 0; i < 5; i++) {
            printf("print %d\n", i);
            sleep(1);
        }
        exit(0);
    }

    return 0;
}

