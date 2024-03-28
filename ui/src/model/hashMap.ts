class HashMap<String>  {
    private map: Map<number, string>;

    constructor() {
        this.map = new Map<number, string>();
    }

    set(key: number, value: string): any {
        this.map.set(key, value);
    }

    get(key: number): string | undefined {
        return this.map.get(key);
    }

    has(key: number): boolean {
        return this.map.has(key);
    }

    delete(key: number): boolean {
        return this.map.delete(key);
    }

    clear(): void {
        this.map.clear();
    }

    keys(): IterableIterator<number> {
        return this.map.keys();
    }

    values(): IterableIterator<string> {
        return this.map.values();
    }

    entries(): IterableIterator<[number, string]> {
        return this.map.entries();
    }

    size(): number {
        return this.map.size;
    }

}