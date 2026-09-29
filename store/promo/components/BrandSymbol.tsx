type Props = {
    size: 'large' | 'small';
};

export default function BrandSymbol({ size }: Props) {
    return (
        <div
            className={`brand-symbol brand-symbol--${size}`}
            aria-hidden="true"
        >
            <span />
            <span />
            <span />
            <span />
        </div>
    );
}
