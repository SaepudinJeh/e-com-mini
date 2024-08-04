export default function formatToIDR(value: number) {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}