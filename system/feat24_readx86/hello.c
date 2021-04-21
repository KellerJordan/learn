#include<unistd.h>

int main() {
    write(STDOUT_FILENO, "hello, world!\n", 20);
    return 0;
}

