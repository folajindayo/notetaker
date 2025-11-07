'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useTranslation } from '@/lib/i18n';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
  externalUrl?: string;
  backgroundColor?: string;
}

interface MintedNFT {
  id: string;
  tokenId: number;
  metadata: NFTMetadata;
  contractAddress: string;
  mintedAt: number;
  txHash: string;
  ipfsHash: string;
}

export default function NFTMintingStudio() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  
  const [step, setStep] = useState<'upload' | 'metadata' | 'preview' | 'mint'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [metadata, setMetadata] = useState<NFTMetadata>({
    name: '',
    description: '',
    image: '',
    attributes: [],
  });
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([
    { trait_type: '', value: '' },
  ]);
  const [minting, setMinting] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([]);
  const [collectionName, setCollectionName] = useState('');
  const [collectionSymbol, setCollectionSymbol] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState('5');
  const [maxSupply, setMaxSupply] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleMint = async () => {
    if (!metadata.name || !metadata.description || !imageFile) {
      alert(t('fillAllFields'));
      return;
    }

    setMinting(true);
    
    // Simulate IPFS upload and minting
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const ipfsHash = `ipfs://Qm${Math.random().toString(36).slice(2, 15)}`;
    
    const mintedNFT: MintedNFT = {
      id: Date.now().toString(),
      tokenId: mintedNFTs.length + 1,
      metadata: {
        ...metadata,
        image: ipfsHash,
        attributes: attributes.filter((a) => a.trait_type && a.value),
      },
      contractAddress: '0x' + Math.random().toString(16).slice(2, 42),
      mintedAt: Date.now(),
      txHash: '0x' + Math.random().toString(16).slice(2, 66),
      ipfsHash,
    };

    setMintedNFTs([mintedNFT, ...mintedNFTs]);
    setMinting(false);
    
    // Reset form
    setStep('upload');
    setImageFile(null);
    setImagePreview('');
    setMetadata({ name: '', description: '', image: '', attributes: [] });
    setAttributes([{ trait_type: '', value: '' }]);
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-gray-600 dark:text-gray-400">{t('connectWalletToMint')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('nftMintingStudio')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t('createAndMintYourNFTs')}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {['upload', 'metadata', 'preview', 'mint'].map((s, index) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === s
                    ? 'bg-blue-500 text-white'
                    : ['upload', 'metadata', 'preview', 'mint'].indexOf(step) >
                      ['upload', 'metadata', 'preview', 'mint'].indexOf(s)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {['upload', 'metadata', 'preview', 'mint'].indexOf(step) > index ? '✓' : index + 1}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {t(s)}
              </span>
            </div>
            {index < 3 && (
              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700"></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('uploadArtwork')}</h3>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🖼️</div>
                <label className="cursor-pointer">
                  <span className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block font-medium">
                    {t('chooseFile')}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {t('supportedFormats')}: PNG, JPG, GIF, SVG
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-lg mx-auto rounded-xl shadow-lg"
                />
                <div className="flex justify-center gap-3">
                  <label className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    {t('changeImage')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => setStep('metadata')}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metadata Step */}
        {step === 'metadata' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('nftMetadata')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('nftName')} *
                  </label>
                  <input
                    type="text"
                    value={metadata.name}
                    onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                    placeholder="My Awesome NFT"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('description')} *
                  </label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                    placeholder="Describe your NFT..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('externalURL')}
                  </label>
                  <input
                    type="url"
                    value={metadata.externalUrl || ''}
                    onChange={(e) => setMetadata({ ...metadata, externalUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('attributes')}
                  </label>
                  <button
                    onClick={handleAddAttribute}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    + {t('add')}
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={attr.trait_type}
                        onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                        placeholder={t('traitType')}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                        placeholder={t('value')}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={() => handleRemoveAttribute(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('upload')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('back')}
              </button>
              <button
                onClick={() => {
                  setMetadata({
                    ...metadata,
                    attributes: attributes.filter((a) => a.trait_type && a.value),
                  });
                  setStep('preview');
                }}
                disabled={!metadata.name || !metadata.description}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
              >
                {t('next')}
              </button>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('previewNFT')}</h3>
            
            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 shadow-lg">
                <img
                  src={imagePreview}
                  alt={metadata.name}
                  className="w-full rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {metadata.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {metadata.description}
                </p>
                
                {attributes.filter((a) => a.trait_type && a.value).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('properties')}:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {attributes
                        .filter((a) => a.trait_type && a.value)
                        .map((attr, index) => (
                          <div
                            key={index}
                            className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                              {attr.trait_type}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {attr.value}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setStep('metadata')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('back')}
              </button>
              <button
                onClick={() => setStep('mint')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                {t('next')}
              </button>
            </div>
          </div>
        )}

        {/* Mint Step */}
        {step === 'mint' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('mintSettings')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('collectionName')}
                </label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="My NFT Collection"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('collectionSymbol')}
                </label>
                <input
                  type="text"
                  value={collectionSymbol}
                  onChange={(e) => setCollectionSymbol(e.target.value)}
                  placeholder="MYNFT"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('royaltyPercentage')} (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={royaltyPercentage}
                  onChange={(e) => setRoyaltyPercentage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('maxSupply')}
                </label>
                <input
                  type="number"
                  value={maxSupply}
                  onChange={(e) => setMaxSupply(e.target.value)}
                  placeholder="10000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300">{t('estimatedGas')}:</span>
                <span className="font-bold text-gray-900 dark:text-white">~0.005 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{t('storageFee')} (IPFS):</span>
                <span className="font-bold text-gray-900 dark:text-white">Free</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('preview')}
                disabled={minting}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {t('back')}
              </button>
              <button
                onClick={handleMint}
                disabled={minting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 font-bold flex items-center justify-center gap-2"
              >
                {minting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('minting')}...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {t('mintNFT')}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Minted NFTs */}
      {mintedNFTs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('yourMintedNFTs')} ({mintedNFTs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mintedNFTs.map((nft) => (
              <div
                key={nft.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <img
                  src={imagePreview}
                  alt={nft.metadata.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {nft.metadata.name}
                    </h4>
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      #{nft.tokenId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {nft.metadata.description}
                  </p>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('minted')}: {new Date(nft.mintedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-mono truncate">
                      IPFS: {nft.ipfsHash.slice(0, 20)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

