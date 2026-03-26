export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: string;
    debug: boolean;
  };

  api: {
    baseUrl: string;
    imageUrl: string;
    defaultImage: string;
    timeout: number;
    retryAttempts: number;
  };

  company: {
    name: string;
    tagline: string;

    branding: {
      logo: {
        url: string;
        alt: string;
      };
      favicon: string;
      themeColor: string;
    };
    address: {
      line:  string;
      city: string;
      country:  string;
      postalCode:  string;
      full:  string;
      mapLink : string;
    },
    contact: {
      primaryPhone: string;
      displayPhone: string;
      email: string;
    };

    support: {
      email: string;
      phone: string;
      displayPhone: string;
      workingHours: string;
    };

    socialMedia: {
      key: string;
      url: string;
      icon: string;
      toolTip: string;
      enabled: boolean;
    }[];
  };
  insights: {
    recommendation_Percentage: number;
    bestSeller_MinSold: 100,
    hotDeal_DiscountPercentage: number;
    newArrival_MaxSold: number;
  },

  currency: {
    base: string;
    default: string;
    defaultCountry: string;
    autoDetect: boolean;
    apis: {
      exchange: string;
      geo: string;
    };
    countryMap: Record<string, string>; // ✅ fix here
    format: {
      showSymbol: boolean;
      decimalPlaces: number;
    };
  };
  location : {
    pincodeApi : string;
    liveLocationApi : string;
  }
}
