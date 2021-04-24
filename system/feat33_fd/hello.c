#include<stdio.h>
#include<string.h>
#include<unistd.h>

int main() {
    char* buf;
    buf = "writing to fd=1\n";
    write(1, buf, strlen(buf));
    sleep(1);
    buf = "writing to fd=2\n";
    write(2, buf, strlen(buf));
    return 0;
}
