import { ActionTree } from 'vuex';
import { RootStoreState } from '@/store/types';
import { Asset, ShopStoreState } from './types';

export default {
  async loadAssetsInfoList({
    rootState,
    state,
    commit
  }): Promise<Array<Asset>> {
    if (state.isLoading && state.loadingPromise !== null) {
      return state.loadingPromise;
    }

    if (!state.isLoading && state.assets.length > 0) {
      return Promise.resolve(state.assets);
    }

    commit('setIsLoading', true);

    // TODO get remote info about shop assets
    // commit("setLoadingPromise", <loadingPromise>);
    const remoteEntries = [
      {
        id: '$CEO1',
        price: 49.99,
        totalTrades: 1345,
        initialQuantity: 30,
        redeemedQuantity: 4,
        remainingQuantity: 26,
        availableQuantity: 7
      },
      {
        id: '$SJ1',
        price: 49.99,
        totalTrades: 255,
        initialQuantity: 30,
        redeemedQuantity: 27,
        remainingQuantity: 2,
        availableQuantity: 1
      },
      {
        id: '$IC1',
        price: 49.99,
        totalTrades: 255,
        initialQuantity: 30,
        redeemedQuantity: 27,
        remainingQuantity: 2,
        availableQuantity: 1
      },
      {
        id: '$PWR01',
        price: 49.99,
        totalTrades: 255,
        initialQuantity: 30,
        redeemedQuantity: 27,
        remainingQuantity: 2,
        availableQuantity: 1
      }
    ];

    const localEntries: Array<Asset> = [
      {
        id: '$CEO1',
        address:
          '0x806cb7767eb835e5fe0e4de354cc946e21418997d01b90d9f98b0e4da195ce92',
        previewImageSrc: require('@/assets/images/cap.png'),
        imageSrc: require('@/assets/images/ceo-of-money-img.png'),
        imageSize: '53%',
        imageScaleH: '38%',
        background: '#dbe2e6',
        title: 'Cap',
        price: '$49.99',
        edition: 'Genesis Edition',
        totalTrades: 0,
        initialQuantity: 0,
        redeemedQuantity: 0,
        remainingQuantity: 0,
        availableQuantity: 0,
        description: '',
        page: {
          videoSrc: require('@/assets/videos/CeoOfMoney.webm'),
          iconSrc: require('@/assets/images/ceo-of-money-icon.png'),
          title: 'CEO of Money'
        }
      },
      {
        id: '$SJ1',
        address:
          '0x806cb7767eb835e5fe0e4de354cb946e21418997d01b90d9f98b0e4da195ce92',
        previewImageSrc: require('@/assets/images/face-mask.png'),
        imageSrc: require('@/assets/images/street-jungle-img.png'),
        imageSize: '47%',
        imageScaleH: '38%',
        background: '#dbe2e6',
        title: 'Face mask',
        price: '$49.99',
        edition: 'Genesis Edition',
        totalTrades: 0,
        initialQuantity: 0,
        redeemedQuantity: 0,
        remainingQuantity: 0,
        availableQuantity: 0,
        description: '',
        page: {
          videoSrc: require('@/assets/videos/CeoOfMoney.webm'),
          iconSrc: require('@/assets/images/ceo-of-money-icon.png'),
          title: 'CEO of Money'
        }
      },
      {
        id: '$IC1',
        address:
          '0x806cb7767eb835f5fe0e4de354cb946e21418997d01b90d9f98b0e4da195ce92',
        previewImageSrc: require('@/assets/images/classic-t-shirt.png'),
        imageSrc: require('@/assets/images/instant-classic-img.png'),
        imageSize: '40%',
        imageScaleH: '100%',
        background: '#f0f6f8',
        title: 'Classic T-Shirt',
        price: '$49.99',
        edition: 'Genesis Edition',
        totalTrades: 0,
        initialQuantity: 0,
        redeemedQuantity: 0,
        remainingQuantity: 0,
        availableQuantity: 0,
        description: '',
        page: {
          videoSrc: require('@/assets/videos/CeoOfMoney.webm'),
          iconSrc: require('@/assets/images/ceo-of-money-icon.png'),
          title: 'CEO of Money'
        }
      },
      {
        id: '$PWR01',
        address:
          '0x806cb7767fb835e5fe0e4de354cb946e21418997d01b90d9f98b0e4da195ce92',
        previewImageSrc: require('@/assets/images/power-t-shirt.png'),
        imageSrc: require('@/assets/images/power-t-shirt-img.png'),
        imageSize: '37%',
        imageScaleH: '58%',
        background: '#f0f6f8',
        title: 'Power T-Shirt',
        price: '$49.99',
        edition: 'Limited Edition',
        totalTrades: 0,
        initialQuantity: 0,
        redeemedQuantity: 0,
        remainingQuantity: 0,
        availableQuantity: 0,
        description: '',
        page: {
          videoSrc: require('@/assets/videos/CeoOfMoney.webm'),
          iconSrc: require('@/assets/images/ceo-of-money-icon.png'),
          title: 'CEO of Money'
        }
      }
    ];

    remoteEntries.forEach((remoteEntry) => {
      const localEntryIdx = localEntries.findIndex(
        (localEntry) => localEntry.id === remoteEntry.id
      );
      if (localEntryIdx < 0) {
        return;
      }

      localEntries[localEntryIdx] = {
        ...localEntries[localEntryIdx],
        totalTrades: remoteEntry.totalTrades,
        initialQuantity: remoteEntry.initialQuantity,
        redeemedQuantity: remoteEntry.redeemedQuantity,
        remainingQuantity: remoteEntry.remainingQuantity,
        availableQuantity: remoteEntry.availableQuantity,
        description: rootState.i18n?.te(
          `nibbleShop.txtAssets.${localEntries[localEntryIdx].id}.description`
        )
          ? (rootState.i18n?.t(
              `nibbleShop.txtAssets.${localEntries[localEntryIdx].id}.description`
            ) as string)
          : localEntries[localEntryIdx].description
      };
    });

    commit('setLoadingPromise', Promise.resolve(localEntries));
    commit('setAssets', localEntries);
    commit('setLoadingPromise', null);
    commit('setIsLoading', false);
    return localEntries;
  }
} as ActionTree<ShopStoreState, RootStoreState>;
