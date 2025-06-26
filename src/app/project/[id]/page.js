'use client';
import { useParams } from 'next/navigation';

export default function Project() {
    const params = useParams(); // gets id from the URL
    const id = params.id;
    return (<>
        <div>Hello world {id}</div>
    </>);
}
