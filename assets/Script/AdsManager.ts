// import Data, { KEY } from './Data';
// import GameManager from './GameManager';

import {Component, _decorator } from "cc";
const { ccclass, property } = _decorator;

const INTERESTIAL_AD_UNIT: string = '598484151154824_604501683886404';
const REWARD_AD_UNIT: string = '598484151154824_604501803886392';
const BANNER_AD_UNIT: string = '598484151154824_604501527219753';

class ADSError extends Error {
    code = 'ADS_NOT_LOADED';
}

@ccclass('AdsManager')
export class AdsManager {
    private preloadedInterstitial = null;
    private preloadedReward = null;
    private preloadedBanner = null;
    private static instance: AdsManager;
    private isLoadedInsterestialAds: boolean = false;
    private isLoadedRewardAds: boolean = false;
    private isLoadedBannerAds: boolean = false;
    private lastShowTime: number = 0;
    private lastShowRewardVideoTime: number = 0;

    private adsRetryTime = 30000;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {}

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): AdsManager {
        if (!AdsManager.instance) {
            AdsManager.instance = new AdsManager();
        }

        return AdsManager.instance;
    }

    private preloadInterestialAds() {
        if (!this.isLoadedInsterestialAds) {
            FBInstant.getInterstitialAdAsync(
                INTERESTIAL_AD_UNIT // Your Ad Placement Id
            )
                .then((interstitial) => {
                    // Load the Ad asynchronously
                    // cc.log(this);
                    this.preloadedInterstitial = interstitial;
                    return this.preloadedInterstitial.loadAsync();
                })
                .then(() => {
                    console.log('Interstitial preloaded');
                    this.isLoadedInsterestialAds = true;
                })
                .catch((err) => {
                    console.error(
                        'Interstitial failed to preload: ' + err.message
                    );
                    setTimeout(
                        function () {
                            this.handleAdsNoFill(this.preloadedInterstitial, 2);
                        }.bind(this),
                        this.adsRetryTime
                    );
                });
        }
    }

    private preloadRewardVideoAds() {
        if (!this.isLoadedRewardAds) {
            FBInstant.getRewardedVideoAsync(
                REWARD_AD_UNIT // Your Ad Placement Id
            )
                .then((rewarded) => {
                    // Load the Ad asynchronously
                    this.preloadedReward = rewarded;
                    return this.preloadedReward.loadAsync();
                })
                .then(() => {
                    console.log('reward preloaded');
                    this.isLoadedRewardAds = true;
                })
                .catch((err) => {
                    console.error('reward failed to preload: ' + err.message);
                    setTimeout(
                        function () {
                            this.handleAdsRewardNoFill(this.preloadedReward, 2);
                        }.bind(this),
                        this.adsRetryTime
                    );
                });
        }
    }

    public loadBannerAds() {
        try {
            FBInstant.loadBannerAdAsync(BANNER_AD_UNIT)
                .then((banner) => {
                    console.log('banner', banner);
                })
                .catch((err) => {
                    console.error('banner failed to load: ' + err.message);
                });
        } catch (exc) {
            console.error(exc);
        }
    }

    public hideBannerAds() {
        try {
            FBInstant.hideBannerAdAsync().then(() => {
                console.log('Banner hide');
            });
        } catch (exc) {
            console.error(exc);
        }
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
     */
    public preload() {
        // this.preloadInterestialAds();
        // this.preloadRewardVideoAds();
        this.loadBannerAds();
    }

    // Here is how the function to handle ADS_NO_FILL would look like
    handleAdsNoFill(adInstance, attemptNumber) {
        if (attemptNumber > 3) {
            // You can assume we will not have to serve in the current session, no need to try
            // to load another ad.
            return;
        } else {
            adInstance
                .loadAsync()
                .then(() => {
                    // This should get called if we finally have ads to serve.
                    console.log('Interstitial preloaded');
                    this.isLoadedInsterestialAds = true;
                })
                .catch((err) => {
                    console.error(
                        'Interstitial failed to preload: ' + err.message
                    );
                    // You can try to reload after 30 seconds
                    setTimeout(() => {
                        this.handleAdsNoFill(adInstance, attemptNumber + 1);
                    }, this.adsRetryTime);
                });
        }
    }

    handleAdsRewardNoFill(adInstance, attemptNumber) {
        if (attemptNumber > 3) {
            // You can assume we will not have to serve in the current session, no need to try
            // to load another ad.
            return;
        } else {
            adInstance
                .loadAsync()
                .then(() => {
                    // This should get called if we finally have ads to serve.
                    console.log('Video reward preloaded');
                    this.isLoadedRewardAds = true;
                })
                .catch((err) => {
                    console.error(
                        'Video reward failed to preload: ' + err.message
                    );
                    // You can try to reload after 30 seconds
                    setTimeout(() => {
                        this.handleAdsRewardNoFill(
                            adInstance,
                            attemptNumber + 1
                        );
                    }, this.adsRetryTime);
                });
        }
    }

    public showInterestialAds(cb = null) {
        var now = Date.now();
        if (now - this.lastShowTime < this.adsRetryTime) {
            cb && cb(Error('CAPPED_TIME'));
            return;
        }
        if (this.preloadedInterstitial == null) {
            cb && cb(Error('NULL inters'));
            return;
        }
        this.preloadedInterstitial
            .showAsync()
            .then(() => {
                // Perform post-ad success operation
                // if (GameManager.getInstance().dataSetting.isMusic)
                // {
                //     cc.audioEngine.resumeMusic()
                // }
                this.isLoadedInsterestialAds = false;
                console.log('Interstitial ad finished successfully');
                this.preloadInterestialAds();
                this.lastShowTime = Date.now();
                cb && cb(null);
            })
            .catch((e) => {
                // if (GameManager.getInstance().dataSetting.isMusic)
                // {
                //     cc.audioEngine.resumeMusic()
                // }
                console.error(e.message);
                cb && cb(e);
            });
    }

    public showRewardedAds(cb = null) {
        var now = Date.now();
        if (now - this.lastShowRewardVideoTime < this.adsRetryTime) {
            cb && cb(Error('CAPPED_TIME REWARD VIDEO'));
            return;
        }

        this.preloadedReward &&
            this.preloadedReward
                .showAsync()
                .then(() => {
                    // Perform post-ad success operation
                    this.isLoadedRewardAds = false;
                    this.reloadRewardedAds();
                    this.lastShowRewardVideoTime = Date.now();
                    cb && cb(null);
                    // if (GameManager.getInstance().dataSetting.isMusic)
                    // {
                    //     cc.audioEngine.resumeMusic()
                    // }
                })
                .catch((e) => {
                    // if (GameManager.getInstance().dataSetting.isMusic)
                    // {
                    //     cc.audioEngine.resumeMusic()
                    // }
                    console.error('ads err', e.message);
                    this.reloadRewardedAds();
                    this.lastShowRewardVideoTime = Date.now();
                    cb && cb(e);
                });

        if (!this.preloadedReward) {
            // this.onAdsRewardFail();
            const e = new ADSError('ADS_NOT_LOADED');
            e.code = 'ADS_NOT_LOADED';
            cb && cb(e);
        }
    }

    private reloadRewardedAds() {
        this.isLoadedRewardAds = false;
        console.log('Rewarded ad finished successfully');
        this.preloadRewardVideoAds();
    }

    onAdsRewardFail() {
        // const ui = find('Canvas/UI');
        // const uiController = ui.getComponent('UIController');
        // let msg = 'NO INTERNET CONNECTION'; // ADS_NOT_LOADED
        // if (e.code === 'USER_INPUT') {
        //     msg = 'PLEASE WAIT FOR ADS TO FILL!'
        // }

        // uiController.showAlert(msg, 2.5);
    }

    getInsterestialPlacementId() {
        return INTERESTIAL_AD_UNIT;
    }

    getRewardPlacementId() {
        return REWARD_AD_UNIT;
    }
}
