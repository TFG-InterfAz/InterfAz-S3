import UpdatePage from '../../../../components/UpdatePage';

export default function Page({ params }: { params: { id: string } }) {
  return <UpdatePage id={params.id} />;
}
