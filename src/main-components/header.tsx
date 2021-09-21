import { Col, Row } from "@common-components";
import { status, text } from "@core";
import * as core from "@core";
import { observer } from "mobx-react";
import { IconButton, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class HeaderView extends React.Component {
	render() {
		return (
			<div
				className="header-component"
				data-login-type={status.loginType}
			>
				<Row>
					<Col span={8}>
						<section className="menu-button">
							<IconButton
								onClick={() => core.menu.show()}
								iconProps={{ iconName: "GlobalNavButton" }}
								ariaLabel="Menu"
								data-testid="expand-menu"
							/>
						</section>
					</Col>
					<Col span={8}>
						<section className="title" data-testid="page-title">
							{
								text(
									(core.router.currentNamespace.toLowerCase() as any) ||
										"home"
								).c
							}
						</section>
					</Col>
					<Col span={8}>
						<section className="right-buttons">
							<TooltipHost content={text("user panel").c}>
								<IconButton
									onClick={() => core.user.show()}
									iconProps={{ iconName: "Contact" }}
									data-testid="expand-user"
								/>
							</TooltipHost>
							{core.status.keepServerOffline ? (
								""
							) : (
								<TooltipHost
									content={
										!core.status.isOnline.server
											? text("server is unavailable").c
											: core.status.invalidLogin
											? text("can't login to server").c
											: text("sync with server").c
									}
								>
									<IconButton
										data-test-id="resync-btn"
										disabled={
											core.status.dbActionProgress
												.length > 0 ||
											core.status.invalidLogin ||
											!core.status.isOnline.server
										}
										onClick={async () => {
											// resync on clicking (manual)
											await core.dbAction("resync");
										}}
										iconProps={{
											iconName: !core.status.isOnline
												.server
												? "WifiWarning4"
												: core.status.invalidLogin
												? "Important"
												: "Sync",
										}}
										className={
											"resync " +
											(core.status.invalidLogin ||
											!core.status.isOnline.server
												? "error"
												: core.status.dbActionProgress
														.length > 0
												? "rotate"
												: "clickable-sync")
										}
										data-testid="resync"
									/>
								</TooltipHost>
							)}
						</section>
					</Col>
				</Row>
			</div>
		);
	}
}
