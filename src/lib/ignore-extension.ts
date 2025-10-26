export default function ignoreExt(name: string) {
    return name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : "";
}
