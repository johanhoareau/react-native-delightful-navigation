/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */


import type { ImageSourcePropType } from "react-native"

export type ItemList = {
	id: number,
	title: string,
	image: ImageSourcePropType | undefined
}

export const ELEMENTS: ItemList[] = [
	{
		id: 0,
		title: "Iles d'Hyères",
		image: require("./assets/iles-d-hyeres-1.webp")
	},
	{
		id: 1,
		title: "Dordogne & Périgord",
		image: require("./assets/dordogne-perigord-1.webp")
	},
	{
		id: 2,
		title: "Bourgogne & Jura",
		image: require("./assets/bourgogne-jura-1.webp")
	},
	{
		id: 3,
		title: "Vosges & Alsace",
		image: require("./assets/vosges-alsace-1.webp")
	},
	{
		id: 4,
		title: "Val de Loire",
		image: require("./assets/val-de-loire-1.webp")
	},
	{
		id: 5,
		title: "Paris",
		image: require("./assets/paris-1.webp")
	},
	{
		id: 6,
		title: "Provence & côte d'Azur",
		image: require("./assets/provence-cote-d-azur-1.webp")
	},
	{
		id: 7,
		title: "Saint-Malo",
		image: require("./assets/saint-malo-1.webp")
	},
	{
		id: 8,
		title: "Occitanie & Pyrénées",
		image: require("./assets/occitanie-pyrenees-1.webp")
	},
	{
		id: 9,
		title: "Sud-Ouest",
		image: require("./assets/sud-ouest-1.webp")
	},
	{
		id: 10,
		title: "Normandie",
		image: require("./assets/normandie-1.webp")
	},
	{
		id: 11,
		title: "Nice",
		image: require("./assets/nice-1.webp")
	},
	{
		id: 12,
		title: "La Rochelle",
		image: require("./assets/la-rochelle-1.webp")
	},
	{
		id: 13,
		title: "Lille",
		image: require("./assets/lille-1.webp")
	},
	{
		id: 14,
		title: "Aix en Provence",
		image: require("./assets/aix-en-provence-1.webp")
	},
]