export interface orderDetailsType {
    billing: billing;
    line_items: line_items[]; // Change line_items to an array
    date_created: string
}

interface billing {
    first_name: string
}

interface line_items {
    name: string
}