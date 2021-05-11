#include<stdio.h>
#include<stdlib.h>
#include<sys/socket.h>
#include<sys/types.h>
#include<netinet/in.h>
#include<arpa/inet.h>

int main() {
    uint16_t h = 8000;
    uint16_t ns = htons(h);
    printf("%ld\n", sizeof h);
    printf("%d %d\n", h, ns);
    printf("%x %x\n", h, ns);

    socklen_t x = 5;
    printf("%ld\n", sizeof x);


    return 0;
}
