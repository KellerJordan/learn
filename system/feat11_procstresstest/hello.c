#include<stdio.h>
#include<unistd.h>
#include<fcntl.h>
#include<errno.h>
#include<stdlib.h>
#include<string.h>
#include<wait.h>
#include<sys/mman.h>
#include<sys/stat.h>

void make100() {
    for (int i = 0; i < 100; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            sleep(5);
            exit(0);
        }
    }
}


int main() {

    // things get weird in the 1,000's. some memory runs out or leaks
    int n_forks = 3000;
    int i;
    int n_made = 0;
    for (i = 0; i < n_forks/100; i++) {
        make100();
        n_made += 100;
        printf("%d made so far\n", n_made);
    }

    return 0;
}

