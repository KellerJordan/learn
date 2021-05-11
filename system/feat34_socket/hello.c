#include<stdio.h>
#include<stdlib.h>
#include<sys/socket.h>
#include<sys/types.h>
#include<netinet/in.h>

int make_socket(uint16_t port) {
    int sock;
    sock = socket(PF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("socket");
        exit(1);
    }
    struct sockaddr_in name = {
        .sin_family = AF_INET,
        .sin_addr = (struct in_addr) {
            .s_addr = htonl(INADDR_ANY),
        },
    };
    /*
    name.sin_family = AF_INET;
    name.sin_port = htons(port);
    name.sin_addr.s_addr = htonl(INADDR_ANY);
    */
    struct sockaddr* addr = (struct sockaddr*) &name;
    if (bind(sock, addr, sizeof *addr) < 0) {
        perror("bind");
        exit(1);
    }
    return sock;
}

int main() {
    int sock = make_socket(8000);


    return 0;
}
