import Image from 'next/image';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';

import StyledItem from './styles/StyledItem';
import StyledPriceTag from './styles/StyledPriceTag';
import StyledTitle from './styles/StyledTitle';

export default function Product({ product }) {
  return (
    <StyledItem>
      <Image
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
        height={400}
        width={400}
        unoptimized
      />
      <StyledTitle>
        <Link href={`/product/${product.id}`}>{product.name}</Link>{' '}
      </StyledTitle>
      <StyledPriceTag>{formatMoney(product.price / 100)}</StyledPriceTag>
      <p>{product.description}</p>
    </StyledItem>
  );
}