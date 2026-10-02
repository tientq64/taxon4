import { maxBy } from 'lodash-es'
import { memo, ReactNode, useMemo } from 'react'
import { RanksMap, species } from '../constants/ranks'
import { getTaxonFullName } from '../helpers/getTaxonFullName'
import { Taxon } from '../helpers/parse'
import { useApp } from '../store/app'
import { formatNumber } from '../utils/formatNumber'
import { lowerFirst } from '../utils/lowerFirst'
import { Descriptions } from './Descriptions'
import { TaxonNode } from './TaxonNode'

/** Mục thống kê. */
function StatsPanelMemo(): ReactNode {
	const { taxa } = useApp()

	const speciesTaxa = useMemo<Taxon[]>(() => {
		return (taxa as Taxon[]).filter((taxon) => taxon.rank.level === RanksMap.species.level)
	}, [taxa])

	const mostChildrenTaxon = useMemo<Taxon | undefined>(() => {
		return maxBy(taxa as Taxon[], 'children.length')
	}, [taxa])

	const longestNameTaxon = useMemo<Taxon | undefined>(() => {
		return maxBy(taxa as Taxon[], (taxon) => {
			if (taxon.rank.level > species.level) return 0
			return getTaxonFullName(taxon, true).length
		})
	}, [taxa])
	const longestNameTaxonFullName = longestNameTaxon && getTaxonFullName(longestNameTaxon, true)

	const taxaHasEnglishCommonName = useMemo<Taxon[]>(() => {
		return (taxa as Taxon[]).filter((taxon) => taxon.textEn)
	}, [taxa])

	const taxaHasVietnameseCommonName = useMemo<Taxon[]>(() => {
		return (taxa as Taxon[]).filter((taxon) => taxon.textVi)
	}, [taxa])

	const taxaHasPhotos = useMemo<Taxon[]>(() => {
		return (taxa as Taxon[]).filter((taxon) => taxon.genderPhotos)
	}, [taxa])

	return (
		<div className="px-3">
			<Descriptions>
				<dt>Tổng số đơn vị phân loại:</dt>
				<dd>{formatNumber(taxa.length)}</dd>

				<dt>Số loài:</dt>
				<dd>{formatNumber(speciesTaxa.length)}</dd>

				<dt>Đơn vị phân loại có nhiều đơn vị phân loại con nhất:</dt>
				{mostChildrenTaxon?.children && (
					<dd>
						{mostChildrenTaxon.rank.textVi}{' '}
						<TaxonNode taxon={mostChildrenTaxon} inline />, với{' '}
						{mostChildrenTaxon.children.length}{' '}
						{lowerFirst(mostChildrenTaxon.children[0].rank.textVi)}.
					</dd>
				)}

				<dt>Loài với tên khoa học dài nhất:</dt>
				{longestNameTaxonFullName && (
					<dd>
						<TaxonNode taxon={longestNameTaxon} inline />, với{' '}
						{longestNameTaxonFullName.replaceAll(' ', '').length} ký tự.
					</dd>
				)}

				<dt>Số đơn vị phân loại có tên tiếng Anh:</dt>
				<dd>
					{formatNumber(taxaHasEnglishCommonName.length)} (
					{Number(((taxaHasEnglishCommonName.length / taxa.length) * 100).toFixed(2))}
					%)
				</dd>

				<dt>Số đơn vị phân loại có tên tiếng Việt:</dt>
				<dd>
					{formatNumber(taxaHasVietnameseCommonName.length)} (
					{Number(((taxaHasVietnameseCommonName.length / taxa.length) * 100).toFixed(2))}
					%)
				</dd>

				<dt>Số đơn vị phân loại có hình ảnh:</dt>
				<dd>
					{formatNumber(taxaHasPhotos.length)} (
					{Number(((taxaHasPhotos.length / taxa.length) * 100).toFixed(2))}
					%)
				</dd>
			</Descriptions>
		</div>
	)
}

export const StatsPanel = memo(StatsPanelMemo)
