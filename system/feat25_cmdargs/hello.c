#include<stdio.h>
#include<unistd.h>

int main(int argc, char** argv) {

    printf("begin cmdline args ====\n");
    for (int i = 0; i < argc; i++) {
        printf("%s\n", argv[i]);
    }
    printf("end cmdline args ====\n");

    printf("begin stdin ====\n");
    int nRead;
    char buf[5000];
    nRead = read(fileno(stdin), &buf, 5000);
    printf("read %d chars\n", nRead);
    printf("%s", buf);
    nRead = read(fileno(stdin), &buf, 5000);
    printf("read %d chars\n", nRead);
    printf("%s", buf);
    /*
    char c;
    while ((c = getc(stdin)) != EOF) {
        putchar(c);
    }
    */
    printf("end stdin ====\n");

    return 0;
}

