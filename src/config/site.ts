/**
 * Site configuration — the single source of truth for game-specific metadata.
 *
 * 👉 APPLY TEMPLATE: Change every field here when building a new game wiki.
 * This is part of the CONFIG LAYER — framework code reads from here, never the reverse.
 */

export interface SiteConfig {
  /** Full site name, used in <title> suffix and Organization JSON-LD. e.g. "Anvil Quest Wiki" */
  name: string;
  /** Short name for PWA manifest, mobile logo, and the long-title <title> suffix (>50 chars). e.g. "AQ Wiki" */
  shortName: string;
  /** Legacy compatibility only; new sites should leave it unset. */
  headerIcon?: string;
  /** Site description for Organization JSON-LD and og:site_name. */
  description: string;
  /** Domain without protocol or trailing slash. e.g. "anvilquestwiki.wiki" */
  domain: string;
  /** Legacy fallback for categories without their own navigationMode setting. */
  enableDropdownNavigation: boolean;
  /** Hero tagline shown under the site title. */
  tagline: string;
  /** Copyright / legal disclaimer line shown in footer. */
  legalNotice: string;
  /**
   * Optional public contact email — rendered as a mailto link on the contact
   * page when set. AdSense reviewers look for a reachable contact channel;
   * if you run no social channels, set this.
   */
  contactEmail?: string;
  social: {
    /** Official game website URL (the game itself, not the wiki). */
    official: string;
    discord?: string;
    youtube?: string;
    twitter?: string;
    reddit?: string;
  };
  /** Exact trusted source URLs allowed by the article-source checker. */
  trustedStorePages?: string[];
  /** Exact trusted reference/material URLs allowed by the article-source checker. */
  trustedMaterialPages?: string[];
  /**
   * Canonical URLs about the GAME (Steam page, official site, Wikipedia entry…).
   * Emitted as Organization JSON-LD `sameAs` — helps Google / AI engines link
   * this wiki to the game's knowledge-graph entity.
   */
  sameAs?: string[];
  game: {
    /** Full game name. */
    name: string;
    /** Optional Steam AppID for the reusable Deals page. Leave unset until configured for a specific game. */
    steamAppId?: number;
    /** Optional Steam store title used by Steam data and retailer offer lookups. */
    steamGameTitle?: string;
    /** Platform: "Roblox" | "Steam" | "Epic Games" | "Mobile" | ... */
    platform: string;
    /** Developer / studio name. */
    developer: string;
    /** Genre description. */
    genre: string;
    /** Information-architecture profile used to order the selected categories. */
    navigationProfile?: NavigationProfile;
    /** ISO release date (optional). */
    releaseDate?: string;
  };
  /**
   * Dimensions of the default OG/Twitter share image (public/images/hero.webp).
   * Emitted as og:image:width / og:image:height so social crawlers can render
   * the share card without downloading the image first.
   */
  ogImageWidth: number;
  ogImageHeight: number;
  /** Default author name for articles without an explicit `author` in frontmatter (E-E-A-T signal). */
  defaultAuthor?: string;
}

export type NavigationProfile =
  | 'rpg'
  | 'mmorpg'
  | 'moba'
  | 'fps'
  | 'battle-royale'
  | 'sandbox'
  | 'strategy'
  | 'simulation'
  | 'card';

export const site: SiteConfig = {
  name: 'Phantom Blade Zero Wiki',
  shortName: 'Phantom Blade Zero Guides',
  description: 'Phantom Blade Zero guides for combat, builds, bosses, quests and endings, with platform comparisons, maps and player resources.',
  domain: 'phantombladezero-game.wiki',
  enableDropdownNavigation: false,
  tagline: 'Routes, combat and decisions for the Wulin world',
  legalNotice: 'Independent fan-made guide site. Not affiliated with or endorsed by S-GAME.',
  // Set a real address if you run no social channels — the contact page
  // renders it as a mailto link.
  contactEmail: '',
  social: {
    official: 'https://pbz.s-game.com/en-US/',
  },
  trustedStorePages: [
    "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=4115450",
    "https://blog.playstation.com/2026/08/17/phantom-blade-zero-state-of-play-dives-deep-into-combat-and-the-wulin-world/",
    "https://store.steampowered.com/app/4115450/",
    "https://store.steampowered.com/news/app/4115450",
    "https://www.playstation.com/en-us/games/phantom-blade-zero/"
  ],
  trustedMaterialPages: [
    "https://allthings.how/phantom-blade-zero-backstreet-courtyard-key/",
    "https://allthings.how/phantom-blade-zero-best-early-game-build/",
    "https://allthings.how/phantom-blade-zero-combat-guide/",
    "https://allthings.how/phantom-blade-zero-how-to-beat-the-gold-masked-one/",
    "https://allthings.how/phantom-blade-zero-triple-threat/",
    "https://beebom.com/how-to-get-backstreet-courtyard-key-in-phantom-blade-zero/",
    "https://en.wikipedia.org/wiki/Phantom_Blade_Zero",
    "https://game8.co/games/Phantom-Blade-Zero/archives/632288",
    "https://gamedevourer.com/phantom-blade-zero-crimson-forest-100-walkthrough/",
    "https://gameinformer.com/2026/08/12/new-phantom-blade-zero-trailer-reveals-donnie-yen-and-an-upcoming-state-of-play",
    "https://gameinformer.com/2026/10/27/phantom-blade-zero-longtime-sonic-ezio-voice-actor-roger-craig-smith-is-the-new-vo-for",
    "https://gamingbolt.com/phantom-blade-zeros-difficulty-options-include-a-unique-spin-on-permadeath-mode",
    "https://howlongtobeat.com/game/129235",
    "https://howtovideogame.com/phantom-blade-zero-best-build/",
    "https://mapgenie.io/phantom-blade-zero",
    "https://mapgenie.io/phantom-blade-zero/maps/crimson-forest",
    "https://maxroll.gg/phantom-blade-zero/guides/how-to-enter-the-crimson-manor",
    "https://pbz.s-game.com/en-US/",
    "https://rpgamer.com/2026/10/phantom-blade-zero-preview-qa/",
    "https://steamcharts.com/app/4115450",
    "https://steamcommunity.com/app/4115450",
    "https://steamcommunity.com/app/4115450/discussions/",
    "https://steamdb.info/app/4115450/charts/",
    "https://thethumbwars.com/how-to-beat-peng-meng-the-axemaster-in-phantom-blade-zero/",
    "https://wehunt.gg/guides/phantom-blade-zero-cookiemonster33-npwr62534_00-dc13a8ba",
    "https://www.eurogamer.net/phantom-blade-zero-review-1",
    "https://www.gametruth.com/guides/phantom-blade-zero-combat-sha-chi-parry-guide/",
    "https://www.ign.com/articles/roger-craig-smith-replaced-original-phantom-blade-zero-actor",
    "https://www.ign.com/maps/phantom-blade-zero",
    "https://www.ign.com/wikis/phantom-blade-zero/Flesh_Lily",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-backstreet-courtyard-key-location/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-best-weapon-jagged-steel/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-crimson-manor-enter/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-endings-true/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-flesh-lily-location/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-four-fierce-axes-walkthrough/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-gold-masked-one-boss-guide/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-illusory-pipa-walkthrough/",
    "https://www.pcgamer.com/games/action/phantom-blade-zero-review/",
    "https://www.pcgamer.com/hardware/phantom-blade-zero-devs-say-the-game-needs-300-gb-of-free-space-for-the-pre-load-process-alongside-updated-system-requirements/",
    "https://www.powerpyx.com/phantom-blade-zero-all-side-quests-guide/",
    "https://www.powerpyx.com/phantom-blade-zero-crimson-forest-collectible-locations",
    "https://www.powerpyx.com/phantom-blade-zero-trophy-guide-roadmap/",
    "https://www.powerpyx.com/phantom-blade-zero-true-ending-guide",
    "https://www.powerpyx.com/phantom-blade-zero-weeping-creek-valley-collectible-locations/",
    "https://www.pushsquare.com/guides/phantom-blade-zero-best-weapons-and-where-to-find-them",
    "https://www.thesixthaxis.com/2026/10/26/phantom-blade-zero-review/",
    "https://www.youtube.com/watch?v=AMDnxdlsjog"
  ],
  game: {
    name: 'Phantom Blade Zero',
    steamAppId: 4115450,
    steamGameTitle: 'Phantom Blade Zero',
    platform: 'PC, PlayStation 5',
    developer: 'S-GAME',
    genre: 'Wuxia action RPG',
    navigationProfile: 'rpg',
    releaseDate: '2026-10-29',
  },
  // og:image dims of the SHIPPED hero.webp — if you replace public/images/hero.webp,
  // update these in src/config/site.ts to match (wrong dims mis-crop share cards).
  ogImageWidth: 1200,
  ogImageHeight: 630,
};

/** Absolute site URL (no trailing slash). Falls back to the Astro `site` config. */
export const siteUrl: string = (process.env.SITE_URL || `https://${site.domain}`).replace(
  /\/$/,
  '',
);
