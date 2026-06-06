import flowchart from "../assets/flowchart.png";
export function Productionplanner_graph(){
    return(
        <section className="image-viewer">
			<div className="image-stage">
				<img id="image" src= {flowchart} alt="flowchart"/>
			</div>
		</section>
    );
}