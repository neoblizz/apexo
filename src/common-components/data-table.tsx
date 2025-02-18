import * as core from "@core";
import * as utils from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import {
	CommandBar,
	ContextualMenu,
	DefaultButton,
	ICommandBarItemProps,
	Icon,
	IconButton,
	MessageBar,
	MessageBarType,
	SearchBox,
} from "office-ui-fabric-react";

interface Cell {
	component: string | React.ReactElement<any>;
	dataValue: string | number;
	onClick?: () => void;
	className?: string;
	visibleOnSize?: string;
}

interface Row {
	id: string;
	cells: Cell[];
	searchableString: string;
	className?: string;
	actions?: {
		key: string;
		title: string;
		icon: string;
		onClick: () => void;
	}[];
	actionsIcon?: string;
}

interface Props {
	maxItemsOnLoad: number;
	heads: string[];
	rows: Row[];
	className?: string;
	commands?: ICommandBarItemProps[];
	onDelete?: (id: string) => void;

	hideSearch?: boolean;

	farItems?: ICommandBarItemProps[];
}

@observer
export class DataTableComponent extends React.Component<Props, {}> {
	@computed get sortableValues() {
		return this.props.rows.map((row) => {
			return isNaN(Number(row.cells[this.currentColIndex].dataValue))
				? row.cells[this.currentColIndex].dataValue
				: Number(row.cells[this.currentColIndex].dataValue);
		});
	}
	@observable ctxMenusOpen: string = "";
	@observable currentColIndex: number = 0;
	@observable sortDirection: number = 1;
	@observable filterString: string = "";

	@observable limit: number = this.props.maxItemsOnLoad;

	@computed
	get filteredRows() {
		return utils.textualFilter(this.props.rows, this.filterString);
	}

	@computed
	get sortedRows() {
		return this.filteredRows
			.map((row, index) => {
				return {
					row,
					index,
				};
			})
			.sort((aVal, bVal) => {
				return this.sortDirection === 1
					? this.compare(
							this.sortableValues[aVal.index],
							this.sortableValues[bVal.index]
					  )
					: this.compare(
							this.sortableValues[bVal.index],
							this.sortableValues[aVal.index]
					  );
			})
			.map((x) => x.row);
	}

	@computed
	get limitedRows() {
		const limitedRows: Row[] = [];
		for (let index = 0; index < this.limit; index++) {
			const item = this.sortedRows[index];
			if (item) {
				limitedRows.push(item);
			}
		}
		return limitedRows;
	}

	@computed get farItems(): ICommandBarItemProps[] {
		const items: ICommandBarItemProps[] = [];
		if (!this.props.hideSearch) {
			items.push({
				key: "a",
				onRender: () => (
					<SearchBox
						value={this.filterString}
						placeholder={core.text("search").c}
						onChange={(ev, newVal) => {
							this.filterString = newVal || "";
						}}
					/>
				),
			});
		}

		if (this.props.farItems) {
			return items.concat(this.props.farItems);
		}
		return items;
	}

	render() {
		return (
			<div className="data-table">
				<CommandBar
					{...{
						className: "commandBar fixed",
						isSearchBoxVisible: !this.props.hideSearch,
						elipisisAriaLabel: core.text("more options").c,
						farItems: this.farItems,
						items: this.props.commands || [],
					}}
				/>
				<table
					className={"responsive ms-table " + this.props.className}
				>
					<thead>
						<tr>
							{this.props.heads.map((head, index) => (
								<th
									className={
										head.toLowerCase().replace(/\s/g, "") +
										"-th table-head-sort" +
										(this.currentColIndex === index
											? " current"
											: "") +
										(this.currentColIndex === index &&
										this.sortDirection === 1
											? " positive"
											: "") +
										(this.currentColIndex === index &&
										this.sortDirection === -1
											? " negative"
											: "")
									}
									colSpan={index === 0 ? 2 : 1}
									key={index}
									onClick={() => {
										if (this.currentColIndex === index) {
											this.sortDirection =
												this.sortDirection * -1;
										} else {
											this.currentColIndex = index;
											this.sortDirection = 1;
										}
									}}
								>
									{head}
									<span className="sort-indicators">
										<Icon
											className="positive"
											iconName="ChevronUpSmall"
										/>
										<Icon
											className="negative"
											iconName="ChevronDownSmall"
										/>
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{this.limitedRows.map((row, index) => {
							return (
								<tr
									key={row.id}
									className={`${row.cells[0].dataValue
										.toString()
										.toLowerCase()
										.replace(/[^a-z]/g, "")} ${
										row.className ? row.className : ""
									}`}
								>
									{row.actions ? (
										<td
											className="row-actions"
											id={`cm-${row.id}`}
											onClick={() =>
												(this.ctxMenusOpen = row.id)
											}
										>
											<Icon
												iconName={
													row.actionsIcon
														? row.actionsIcon
														: "More"
												}
											></Icon>
											{this.ctxMenusOpen === row.id ? (
												<ContextualMenu
													items={
														row.actions
															? row.actions.map(
																	(
																		action
																	) => ({
																		key:
																			action.key,
																		text:
																			action.title,
																		title:
																			action.title,
																		iconProps: {
																			iconName:
																				action.icon,
																		},
																		onClick:
																			action.onClick,
																	})
															  )
															: []
													}
													target={`#cm-${row.id} i`}
													onDismiss={() => {
														this.ctxMenusOpen = "";
													}}
												></ContextualMenu>
											) : (
												""
											)}
										</td>
									) : (
										[]
									)}
									{row.cells.map((cell, index2) => {
										return (
											<td
												className={
													(cell.onClick
														? "clickable "
														: "") +
													(cell.className
														? cell.className
														: "")
												}
												key={index2}
												data-head={
													this.props.heads[index2] ||
													""
												}
												onClick={cell.onClick}
												onAuxClick={(e) => {
													this.ctxMenusOpen = row.id;
													e.stopPropagation();
													return e.preventDefault();
												}}
											>
												{typeof cell.component ===
												"string"
													? cell.component
													: cell.component}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>

				{this.limitedRows.length < this.filteredRows.length ? (
					<DefaultButton
						className="load-more"
						iconProps={{ iconName: "more" }}
						onClick={() => (this.limit = this.limit + 10)}
						text={core.text("load more").c}
					/>
				) : (
					""
				)}

				{this.props.rows.length === 0 ? (
					<MessageBar
						className="dt-msg-bar"
						messageBarType={MessageBarType.info}
					>
						{
							core.text(
								"no data in this section yet, you can add new data by clicking the button above"
							).c
						}
					</MessageBar>
				) : this.filteredRows.length === 0 ? (
					<MessageBar
						className="dt-msg-bar"
						messageBarType={MessageBarType.info}
					>
						{
							core.text(
								"did not find anything that matches your search criteria"
							).c
						}
					</MessageBar>
				) : (
					""
				)}
			</div>
		);
	}

	private compare(a: string | number, b: string | number) {
		return typeof a === "number" && typeof b === "number"
			? a - b
			: a.toString().localeCompare(b.toString());
	}
}
