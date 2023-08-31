declare module 'html2canvas-proxy';

declare interface XDomainRequest {
    onload(): void;
    onerror(): void;
    onprogress(): void;
    ontimeout(): void;
    timeout: number;
    open(method: string, url: string): void;
    send(data?: string): void;
    abort(): void;
    responseType: string;
    responseText: string;
    contentType: string;
}
