export function Costum_recipetable(){
	return(
		<main id="planner">
			<section>
				<form>
					<div title="new-recipe">
						<a href="rezepte-erstellen-bearbeiten.html" title="btn">Neues Rezept erstellen</a>
					</div>
					<div title="table-wrapper">
						<table title="table-info">
							<caption>Costum-Rezepte</caption>
							<thead>
								<th><input type="checkbox" title="all"/></th>
								<th>Name</th>
								<th></th>
								<th></th>
							</thead>
							<tbody>
								<tr>
									<td><input type="checkbox" name="Rezept" title="check1"/></td>
									<td title="recipe-name">Mein Rezept</td>
									<td><a href="rezepte-erstellen-bearbeiten.html">Bearbeiten</a></td>
									<td><button>Löschen</button></td>
								</tr>
								<tr>
									<td><input type="checkbox" name="Rezept" title="check1"/></td>
									<td title="recipe-name">Mein Rezept 2 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
									<td><a href="rezepte-erstellen-bearbeiten.html">Bearbeiten</a></td>
									<td><button>Löschen</button></td>
								</tr>
								<tr>
									<td><input type="checkbox" name="Rezept" title="check1"/></td>
									<td title="recipe-name">Mein Rezept 3</td>
									<td><a href="rezepte-erstellen-bearbeiten.html">Bearbeiten</a></td>
									<td><button>Löschen</button></td>
								</tr>
								<tr>
									<td><input type="checkbox" name="Rezept" title="check1"/></td>
									<td title="recipe-name">Mein Rezept 4 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</td>
									<td><a href="rezepte-erstellen-bearbeiten.html">Bearbeiten</a></td>
									<td><button>Löschen</button></td>
								</tr>
							</tbody>
						</table>
					</div>
				</form>
			</section>
		</main>
	)
}