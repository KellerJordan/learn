#include<stdio.h>
#include<string.h>
#include<unistd.h>

int main() {
    char* str1 = "hello, world!\n";
    char* str2 = "bvello berl\n";

    //write(fileno(stdout), str1, strlen(str1)+1);
    printf("%s", str1);
    fflush(stdout);
    sleep(2);
    write(fileno(stdout), str2, strlen(str2)+1);
}

