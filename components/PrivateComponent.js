import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useEffect, useMemo, useState } from 'react';
import LoadingComponent from './LoadingComponent';
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from './Table';
import CategoryForm from './CategoryForm';
import { Toaster, toast, resolveValue } from "react-hot-toast";

const CATEGORIES_QUERY = gql`
  query categories{
    categories {
      id
      name
    }
  }
`;

const DELETE_CATEGORY_MUTATION = gql`
  mutation deleteCategory($categoryId:ID!){
    deleteCategory(id:$categoryId)
  }
`;

const PrivateComponent = () => {
  // Fetch data
  const { data, loading, error , refetch} = useQuery(CATEGORIES_QUERY);
  
  const [deleteCategory] = useMutation(DELETE_CATEGORY_MUTATION);
  // Window show hide
  const [categoryFormPurpose, setCategoryFormPurpose] = useState();
  // Toast show hide
  const [info, setInfo] = useState(null);
  // Category Id
  const [category, setCategory] = useState({'id': null});

  // Detect state change for certain fields
  useEffect(() => {
      refetch();
  }, [categoryFormPurpose]);

  useEffect(() => {
    console.log("Info : ", info);
    if (info === "insert_success"){
      toast.success('Category inserted successful')
    }else if (info === "update_success"){
      toast.success('Category update successful')
    }else if (info === "delete_success"){
      toast.success('Category delete successful')      
    }else if (info){
      toast.error(info)
    }
  }, [info]);

  const handleEdit = (cell) => {
    setCategoryFormPurpose("updateCategory")
    console.log(cell.row.values)
    setCategory(cell.row.values)
    console.log(category)
  }

  const handleDelete = async (cell) => {
    try {
      const { data } = await deleteCategory({
        variables: {
          categoryId: cell.row.values["id"]
        },
      });
      console.log(data)
      if (data?.deleteCategory == "OK") {
        setInfo("delete_success");
        refetch();
      }
    } catch (error) {
      setInfo(error);
    }    
  }

  // Grid column
  const columns = useMemo(() => [
    {
      Header: "Id",
      accessor: 'id',
    },
    {
      Header: "Name",
      accessor: 'name',
    },
    {
      Header: "Actions",
      id: 'edit',
      Cell: cell => (
        <div className='space-x-1.5'>
            <button onClick={() => handleEdit(cell)}>Edit</button> 
            <button onClick={() => handleDelete(cell)}>Delete</button>
        </div>
      )
    }
  ], []);

  // Ui
  return (
    <>
      {categoryFormPurpose && (
        <CategoryForm
          categoryFormPurpose={categoryFormPurpose}
          setCategoryFormPurpose={setCategoryFormPurpose}
          setInfo={setInfo}
          category={category}
        />
      )}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-x text-red-700">
            <button
              type="button"
              onClick={() => {setCategoryFormPurpose('createCategory'); }}
              className="float-right group relative flex justify-end py-2 px-4 mt-3 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3" />
              Register category
            </button>
            <br/>

            {loading ? <LoadingComponent /> : <Table columns={columns} data={data ? data.categories : []} />}
            {error && 'Something went wrong 😕'}
        </div>
      </div>
    </>
  );
};

export default PrivateComponent;
