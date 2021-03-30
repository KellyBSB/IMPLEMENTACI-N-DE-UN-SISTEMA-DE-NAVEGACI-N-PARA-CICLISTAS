export interface Welcome3 {
    plus_code: PlusCode;
    results:   Result[];
    status:    string;
}

interface PlusCode {
    compound_code: string;
    global_code:   string;
}

interface Result {
    address_components: AddressComponent[];
    formatted_address:  string;
    geometry:           Geometry;
    place_id:           string;
    types:              string[];
    plus_code?:         PlusCode;
}
interface AddressComponent {
    long_name:  string;
    short_name: string;
    types:      string[];
}

interface Geometry {
    bounds:        Bounds;
    location:      Location;
    location_type: string;
    viewport:      Bounds;
}

interface Bounds {
    northeast: Location;
    southwest: Location;
}

interface Location {
    lat: number;
    lng: number;
}
