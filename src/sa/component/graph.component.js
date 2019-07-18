export class GraphComponent extends HTMLElement {
    static get TAG() {
        return 'sa-graph';
    }

    constructor() {
        super();
        this._width = 800;
        this._height = 600;
        this._paddingLeft = 30;
        this._paddingBottom = 25;
        this._canvas = document.createElement('canvas');
        
        this._ctx = this._canvas.getContext('2d');
    }

    connectedCallback() {
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d');
        this.appendChild(this._canvas);
        this._canvas.style.width = '100%';
        this._canvas.style.height = '100%';
        this._canvas.height = this._height;
        this._canvas.width = this._width;
    }

    /**
     * [{label:'', value: number}]
     * @param {*} dataPoints
     */
    setData(dataPoints) {
        const maxY = this._getMaxYValue(dataPoints);
        this._drawAxis(this._getXLabels(dataPoints), maxY);
        this._drawData(dataPoints, maxY);
    }

    _getMaxYValue(data) {
        let max = 0;
        data.forEach(dp => (dp.value > max ? (max = dp.value) : max));
        return max;
    }

    _getXLabels(data) {
        return data.map(dataPoint => dataPoint.label);
    }

    _drawData(data, maxY) {
        const ySteps = 1;
        const intervalX = (this._width - this._paddingLeft) / (data.length + 1);
        const intervalY = (this._height - this._paddingBottom - 10) / (maxY / ySteps);
        this._ctx.strokeStyle = 'red';
        this._ctx.beginPath();
        this._ctx.moveTo(this._paddingLeft, this._height - this._paddingBottom);

        data.forEach((dataPoint, idx) => {
            const xPos = this._paddingLeft + intervalX * idx + intervalX;
            const yPos = this._height - intervalY * dataPoint.value - this._paddingBottom + (dataPoint.value ? intervalY : 0);
            this._ctx.lineTo(xPos, yPos);
            this._ctx.arc(xPos, yPos, 5, 0, 2 * Math.PI);
            this._ctx.moveTo(xPos, yPos);
        });
        this._ctx.stroke();
    }

    /**
     *
     * @param {[]} xLabels
     * @param {number} maxY
     */
    _drawAxis(xLabels, maxY, ySteps = 1) {
        const interval = (this._width - this._paddingLeft) / (xLabels.length + 1);
        this._ctx.strokeStyle = 'black';
        this._ctx.beginPath();
        this._ctx.moveTo(this._paddingLeft, this._height - this._paddingBottom);
        this._ctx.lineTo(this._paddingLeft, 10);
        this._ctx.moveTo(this._paddingLeft, this._height - this._paddingBottom);
        this._ctx.lineTo(this._width - interval / 2, this._height - this._paddingBottom);
        this._ctx.stroke();
        this._ctx.strokeStyle = 'lightgray';
        this._ctx.beginPath();
        this._ctx.textAlign = 'center';
        this._ctx.textBaseline = 'middle';
        xLabels.forEach((label, idx) => {
            const xPos = this._paddingLeft + interval * idx + interval;
            this._ctx.moveTo(xPos, this._height - 25);
            this._ctx.lineTo(xPos, 10);
            this._ctx.fillText(label, xPos, this._height - this._paddingBottom / 2);
        });

        this._ctx.stroke();
        this._ctx.beginPath();

        const intervalY = (this._height - this._paddingBottom - 10) / (maxY / ySteps);
        this._ctx.strokeStyle = 'black';
        [...new Array(maxY / ySteps)].forEach((label, idx) => {
            const yPos = this._height - intervalY * idx - this._paddingBottom;
            this._ctx.moveTo(this._paddingLeft - 5, yPos);
            this._ctx.lineTo(this._paddingLeft + 5, yPos);
            this._ctx.fillText(idx, this._paddingLeft / 2, yPos);
        });

        this._ctx.stroke();
    }
}

window.customElements.define(GraphComponent.TAG, GraphComponent);
