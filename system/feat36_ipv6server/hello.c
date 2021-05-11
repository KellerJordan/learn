#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<unistd.h>
#include<sys/socket.h>
#include<sys/types.h>
#include<netinet/in.h>
#include<arpa/inet.h>
#include<netdb.h>
#include<time.h>
#include<sys/times.h>

int make_socket() {
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
    uint16_t port = 30000 + rand() % 1000;
    fprintf(stderr, "port: %d\n", port);
    name.sin_port = htons(8000);
    struct sockaddr* addr = (struct sockaddr*) &name;
    if (bind(sock, addr, sizeof name) < 0) {
        perror("bind");
        exit(1);
    }
    return sock;
}

void init_sockaddr(struct sockaddr_in *name, const char* hostname, uint16_t port) {
    struct hostent* hostinfo;
    name->sin_family = AF_INET;
    name->sin_port = htons(port);
    hostinfo = gethostbyname(hostname);
    if (hostinfo == NULL) {
        perror("unk host");
        exit(1);
    }
    name->sin_addr = *(struct in_addr*) hostinfo->h_addr;
}

static struct timespec time0;
static struct timespec time1;
static int step = 0;
void print_time() {
    clock_gettime(CLOCK_REALTIME, &time1);
    long ns_elapsed = time1.tv_nsec - time0.tv_nsec;
    long us_elapsed = 1000000 * (time1.tv_sec - time0.tv_sec) + ns_elapsed/1000;
    fprintf(stderr, "step %d: elapsed %ldus\n", step++, us_elapsed);
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        fprintf(stderr, "incorrect usage; ./main SITE REQUEST_FILE\n");
        exit(1);
    }
    char* domain = argv[1];
    char* reqf = argv[2];
    clock_gettime(CLOCK_REALTIME, &time0);
    print_time();

    int sock = make_socket();
    print_time();

    struct sockaddr_in name;
    init_sockaddr(&name, domain, 80);
    fprintf(stderr, "completed dns lookup: %s=%s\n", domain, inet_ntoa(name.sin_addr));
    print_time();

    if (connect(sock, (struct sockaddr*) &name, sizeof name) < 0) {
        perror("connect");
        exit(1);
    }
    fprintf(stderr, "connected\n");
    print_time();

    char buf[50001];
    FILE* f = fopen(reqf, "r");
    if (f == NULL) {
        perror("fopen");
        exit(1);
    }
    int requestLen = fread(buf, 1, sizeof buf - 1, f);
    if (requestLen < 0) {
        perror("fread");
        exit(1);
    }
    buf[requestLen] = '\0';
    fprintf(stderr, "read request from request.txt: \n%s\n", buf);
    print_time();

    int nWrote = write(sock, buf, strlen(buf)+1);
    if (nWrote < 0) {
        perror("write");
        exit(1);
    }
    fprintf(stderr, "wrote %d\n", nWrote);
    print_time();

    int nRead = read(sock, buf, sizeof buf - 1);
    if (nRead < 0) {
        perror("read");
        exit(1);
    }
    buf[nRead] = '\0';
    fprintf(stderr, "read %d\n", nRead);
    print_time();

    close(sock);
    fprintf(stdout, "%s", buf);

    return 0;
}
