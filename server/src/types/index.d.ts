// Bugfix for missing webcrypto typescript definitions
// https://stackoverflow.com/questions/71525466/property-subtle-does-not-exist-on-type-typeof-webcrypto
declare module "crypto" {
    namespace webcrypto {
        function getRandomValues<T extends ArrayBufferView | null>(array: T): T;
        function randomUUID(): string;

        const subtle: SubtleCrypto;
    }
}