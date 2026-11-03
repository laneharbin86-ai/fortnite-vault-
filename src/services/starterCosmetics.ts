/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CosmeticItem } from '../types/fortnite';

export const STARTER_COSMETICS: CosmeticItem[] = [
  {
    id: "Character_AbstractMirror_Rogue",
    name: "Solid Snake",
    description: "Legendary mercenary and stealth operative.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "gaminglegends", displayValue: "Gaming Legends Series", backendValue: "EFortRarity::Epic" },
    series: { value: "Gaming Legends Series", colors: ["8078ffff", "5328d6ff", "3e1398ff", "28085fff", "0d0027ff"] },
    set: { value: "Sneaking", text: "Part of the Sneaking set." },
    introduction: { chapter: "5", season: "1", text: "Introduced in Chapter 5, Season 1." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/character_abstractmirror_rogue/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/character_abstractmirror_rogue/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/character_abstractmirror_rogue/smallicon.png"
    },
    variants: [
      {
        channel: "Progressive",
        type: "style",
        options: [
          { tag: "Stage1", name: "Solid Snake", image: "https://fortnite-api.com/images/cosmetics/br/character_abstractmirror_rogue/variants/progressive/stage1.png" },
          { tag: "Stage2", name: "Solid Snake (goggles)", image: "https://fortnite-api.com/images/cosmetics/br/character_abstractmirror_rogue/variants/progressive/stage2.png" },
          { tag: "Stage3", name: "Old Snake", image: "https://fortnite-api.com/images/cosmetics/br/character_abstractmirror_rogue/variants/progressive/stage3.png" }
        ]
      }
    ],
    added: "2024-01-23T13:34:48Z"
  },
  {
    id: "CID_703_Athena_Commando_M_CatBurglar",
    name: "Midas",
    description: "All that glitters is yours.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "legendary", displayValue: "Legendary", backendValue: "EFortRarity::Legendary" },
    set: { value: "Golden Ghost", text: "Part of the Golden Ghost set." },
    introduction: { chapter: "2", season: "2", text: "Introduced in Chapter 2, Season 2." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_703_athena_commando_m_catburglar/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_703_athena_commando_m_catburglar/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_703_athena_commando_m_catburglar/smallicon.png"
    },
    variants: [
      {
        channel: "Faction",
        type: "style",
        options: [
          { tag: "Default", name: "Default" },
          { tag: "Ghost", name: "Ghost" },
          { tag: "Shadow", name: "Shadow" }
        ]
      }
    ],
    added: "2020-02-20T09:00:00Z"
  },
  {
    id: "CID_357_Athena_Commando_M_Banana",
    name: "Peely",
    description: "Go bananas.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "epic", displayValue: "Epic", backendValue: "EFortRarity::Epic" },
    set: { value: "Banana Bunch", text: "Part of the Banana Bunch set." },
    introduction: { chapter: "1", season: "8", text: "Introduced in Chapter 1, Season 8." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_357_athena_commando_m_banana/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_357_athena_commando_m_banana/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_357_athena_commando_m_banana/smallicon.png"
    },
    added: "2019-02-28T09:00:00Z"
  },
  {
    id: "CID_315_Athena_Commando_M_TeriyakiAssassin",
    name: "Fishstick",
    description: "Keep fresh.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
    set: { value: "Fish Food", text: "Part of the Fish Food set." },
    introduction: { chapter: "1", season: "7", text: "Introduced in Chapter 1, Season 7." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_315_athena_commando_m_teriyakiassassin/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_315_athena_commando_m_teriyakiassassin/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_315_athena_commando_m_teriyakiassassin/smallicon.png"
    },
    added: "2018-12-27T00:00:00Z"
  },
  {
    id: "CID_761_Athena_Commando_M_JackGourdon",
    name: "Travis Scott",
    description: "LA FLAME.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "icon", displayValue: "Icon Series", backendValue: "EFortRarity::Epic" },
    series: { value: "Icon Series" },
    set: { value: "Travis Scott", text: "Part of the Travis Scott set." },
    introduction: { chapter: "2", season: "2", text: "Introduced in Chapter 2, Season 2." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_761_athena_commando_m_jackgourdon/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_761_athena_commando_m_jackgourdon/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_761_athena_commando_m_jackgourdon/smallicon.png"
    },
    added: "2020-04-21T13:40:00Z"
  },
  {
    id: "CID_028_Athena_Commando_F",
    name: "Renegade Raider",
    description: "Rare renegade raider outfit.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
    set: { value: "Storm Scavenger", text: "Part of the Storm Scavenger set." },
    introduction: { chapter: "1", season: "1", text: "Introduced in Chapter 1, Season 1." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_028_athena_commando_f/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_028_athena_commando_f/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_028_athena_commando_f/smallicon.png"
    },
    added: "2017-10-26T00:00:00Z"
  },
  {
    id: "CID_035_Athena_Commando_M_Medieval",
    name: "Black Knight",
    description: "The odious scourge of Wailing Woods.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "legendary", displayValue: "Legendary", backendValue: "EFortRarity::Legendary" },
    set: { value: "Fort Knights", text: "Part of the Fort Knights set." },
    introduction: { chapter: "1", season: "2", text: "Introduced in Chapter 1, Season 2." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_035_athena_commando_m_medieval/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_035_athena_commando_m_medieval/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_035_athena_commando_m_medieval/smallicon.png"
    },
    added: "2017-12-14T00:00:00Z"
  },
  {
    id: "CID_164_Athena_Commando_M_RiftStyle",
    name: "Drift",
    description: "Journey into the unknown, and find your way to victory.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "legendary", displayValue: "Legendary", backendValue: "EFortRarity::Legendary" },
    set: { value: "Drift", text: "Part of the Drift set." },
    introduction: { chapter: "1", season: "5", text: "Introduced in Chapter 1, Season 5." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_164_athena_commando_m_riftstyle/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_164_athena_commando_m_riftstyle/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_164_athena_commando_m_riftstyle/smallicon.png"
    },
    added: "2018-07-12T00:00:00Z"
  },
  {
    id: "Character_Standout_Comic",
    name: "Spider-Man (Miles Morales)",
    description: "Brooklyn's one and only Spider-Man.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "marvel", displayValue: "MARVEL SERIES", backendValue: "EFortRarity::Epic" },
    series: { value: "MARVEL SERIES" },
    set: { value: "Across the Spider-Verse", text: "Part of the Across the Spider-Verse set." },
    introduction: { chapter: "4", season: "2", text: "Introduced in Chapter 4, Season 2." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/character_standout_comic/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/character_standout_comic/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/character_standout_comic/smallicon.png"
    },
    added: "2023-05-23T13:00:00Z"
  },
  {
    id: "Pickaxe_ID_415_AbstractMirror",
    name: "Stun Knife",
    description: "Silent and non-lethal.",
    type: { value: "pickaxe", displayValue: "Pickaxe", backendValue: "AthenaPickaxe" },
    rarity: { value: "gaminglegends", displayValue: "Gaming Legends Series", backendValue: "EFortRarity::Rare" },
    series: { value: "Gaming Legends Series" },
    set: { value: "Sneaking", text: "Part of the Sneaking set." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_415_abstractmirror/icon.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/pickaxe_id_415_abstractmirror/smallicon.png"
    },
    added: "2024-01-23T13:34:48Z"
  },
  {
    id: "Glider_AbstractMirror",
    name: "Slider",
    description: "Infiltrate from above.",
    type: { value: "glider", displayValue: "Glider", backendValue: "AthenaGlider" },
    rarity: { value: "gaminglegends", displayValue: "Gaming Legends Series", backendValue: "EFortRarity::Epic" },
    series: { value: "Gaming Legends Series" },
    set: { value: "Sneaking", text: "Part of the Sneaking set." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/glider_abstractmirror/icon.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/glider_abstractmirror/smallicon.png"
    },
    added: "2024-01-23T13:34:48Z"
  },
  {
    id: "Backpack_AbstractMirror",
    name: "Metal Gear Mk. II",
    description: "Backs you up on the battlefield.",
    type: { value: "backpack", displayValue: "Back Bling", backendValue: "AthenaBackpack" },
    rarity: { value: "gaminglegends", displayValue: "Gaming Legends Series", backendValue: "EFortRarity::Epic" },
    series: { value: "Gaming Legends Series" },
    set: { value: "Sneaking", text: "Part of the Sneaking set." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/backpack_abstractmirror/icon.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/backpack_abstractmirror/smallicon.png"
    },
    added: "2024-01-23T13:34:48Z"
  },
  {
    id: "EID_Floss",
    name: "Floss",
    description: "Express yourself on the battlefield.",
    type: { value: "emote", displayValue: "Emote", backendValue: "AthenaDance" },
    rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
    introduction: { chapter: "1", season: "2", text: "Introduced in Chapter 1, Season 2." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/eid_floss/icon.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/eid_floss/smallicon.png"
    },
    added: "2017-12-14T00:00:00Z"
  },
  {
    id: "EID_TakeTheL",
    name: "Take the L",
    description: "Savor the W.",
    type: { value: "emote", displayValue: "Emote", backendValue: "AthenaDance" },
    rarity: { value: "rare", displayValue: "Rare", backendValue: "EFortRarity::Rare" },
    introduction: { chapter: "1", season: "3", text: "Introduced in Chapter 1, Season 3." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/eid_takethel/icon.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/eid_takethel/smallicon.png"
    },
    added: "2018-02-22T00:00:00Z"
  },
  {
    id: "CID_175_Athena_Commando_M_Celestial",
    name: "Galaxy",
    description: "Victory in a stellar constellation.",
    type: { value: "outfit", displayValue: "Outfit", backendValue: "AthenaCharacter" },
    rarity: { value: "epic", displayValue: "Epic", backendValue: "EFortRarity::Epic" },
    set: { value: "Galaxy", text: "Part of the Galaxy set." },
    introduction: { chapter: "1", season: "5", text: "Introduced in Chapter 1, Season 5." },
    images: {
      icon: "https://fortnite-api.com/images/cosmetics/br/cid_175_athena_commando_m_celestial/icon.png",
      featured: "https://fortnite-api.com/images/cosmetics/br/cid_175_athena_commando_m_celestial/featured.png",
      smallIcon: "https://fortnite-api.com/images/cosmetics/br/cid_175_athena_commando_m_celestial/smallicon.png"
    },
    added: "2018-08-09T00:00:00Z"
  }
];
