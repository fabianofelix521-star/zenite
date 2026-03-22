import { useState, useCallback } from 'react';
import { Address, ShippingOption } from '@/types';
import { SHIPPING_REGIONS } from '@/constants/config';

export function useShipping() {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<Address | null>(null);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateShipping = useCallback(async (inputCep: string) => {
    const cleanCep = inputCep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    // Simulated BrasilAPI CEP lookup
    await new Promise((r) => setTimeout(r, 800));

    const cepRegions: Record<string, { cidade: string; uf: string; bairro: string; logradouro: string }> = {
      '0': { cidade: 'São Paulo', uf: 'SP', bairro: 'Centro', logradouro: 'Rua da Consolação' },
      '1': { cidade: 'São Paulo', uf: 'SP', bairro: 'Pinheiros', logradouro: 'Rua dos Pinheiros' },
      '2': { cidade: 'Rio de Janeiro', uf: 'RJ', bairro: 'Copacabana', logradouro: 'Av. Atlântica' },
      '3': { cidade: 'Belo Horizonte', uf: 'MG', bairro: 'Savassi', logradouro: 'Rua Pernambuco' },
      '4': { cidade: 'Salvador', uf: 'BA', bairro: 'Barra', logradouro: 'Av. Oceânica' },
      '5': { cidade: 'Recife', uf: 'PE', bairro: 'Boa Viagem', logradouro: 'Av. Boa Viagem' },
      '6': { cidade: 'Fortaleza', uf: 'CE', bairro: 'Meireles', logradouro: 'Av. Beira Mar' },
      '7': { cidade: 'Campinas', uf: 'SP', bairro: 'Cambuí', logradouro: 'Rua Barão de Jaguara' },
      '8': { cidade: 'Curitiba', uf: 'PR', bairro: 'Batel', logradouro: 'Rua Batel' },
      '9': { cidade: 'Porto Alegre', uf: 'RS', bairro: 'Moinhos', logradouro: 'Rua Padre Chagas' },
    };

    const region = cepRegions[cleanCep[0]] || cepRegions['0'];
    const addr: Address = {
      cep: cleanCep,
      logradouro: region.logradouro,
      bairro: region.bairro,
      cidade: region.cidade,
      uf: region.uf,
    };
    setAddress(addr);

    const multipliers = SHIPPING_REGIONS[addr.uf] || SHIPPING_REGIONS.DEFAULT;
    const basePac = 12.90;
    const baseSedex = 22.90;

    const shippingOptions: ShippingOption[] = [
      {
        name: 'PAC - Correios',
        price: Math.round(basePac * multipliers.pacMultiplier * 100) / 100,
        days: `${5 + Math.floor(multipliers.pacMultiplier * 3)}-${8 + Math.floor(multipliers.pacMultiplier * 3)} dias úteis`,
        type: 'pac',
      },
      {
        name: 'SEDEX - Correios',
        price: Math.round(baseSedex * multipliers.sedexMultiplier * 100) / 100,
        days: `${2 + Math.floor(multipliers.sedexMultiplier)}-${4 + Math.floor(multipliers.sedexMultiplier)} dias úteis`,
        type: 'sedex',
      },
    ];

    if (addr.uf === 'SP') {
      shippingOptions.push({
        name: 'Entrega Expressa',
        price: 34.90,
        days: '1-2 dias úteis',
        type: 'express',
      });
    }

    setOptions(shippingOptions);
    setLoading(false);
  }, []);

  return { cep, setCep, address, options, loading, error, calculateShipping };
}
