export interface Welcome1 {
    destination_addresses: string[];
    origin_addresses:      string[];
    rows:                  Row[];
    status:                string;
}

interface Row {
    elements: Element[];
}
interface Element {
    distance: Distance;
    duration: Distance;
    status:   string;
}

interface Distance {
    text:  string;
    value: number;
}