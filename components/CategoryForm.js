import { useApolloClient, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useState } from 'react';
import { useAuth } from './AuthProvider';


const CREATE_CATEGORY_MUTATION = gql`
  mutation createCategory($category: CategoryCreateInput!){
    createCategory(input:{category: $category}){
      message
      category {
        id
      }
    }
  }
`;


const UPDATE_CATEGORY_MUTATION = gql`
  mutation updateCategory($category: CategoryCreateInput!, $categoryId: ID!){
    updateCategory(input:{category: $category, categoryId: $categoryId}){
      message
      category {
        id
      }
    }
  }
`;

const CategoryForm = ({ categoryFormPurpose, setCategoryFormPurpose, setInfo, category}) => {
  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION);
  const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    const { name } = event.target.elements;

    try {
      console.log('Input name : ', name.value);
      const { data } = await createCategory({
        variables: {
          category: {
            name: name.value
          }
        },
      });
      console.log(data);
      if (data?.createCategory?.message == "OK") {
        setCategoryFormPurpose(undefined);
        setInfo("insert_success");
      }
    } catch (error) {
      console.log(error);
      let error_msg = error["message"].split(":")[1];
      setError(error_msg)
      setInfo(error_msg);
    }
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    const { name } = event.target.elements;

    try {
      console.log('Input name : ', name.value);
      const { data } = await updateCategory({
        variables: {
          category: {
            name: name.value,
          },
          categoryId: category.id
        },
      });
      console.log(data);
      if (data?.updateCategory?.message == "OK") {
        setCategoryFormPurpose(undefined);
        setInfo("update_success");
      }
    } catch (error) {
      console.log(error);
      let error_msg = error["message"].split(":")[1];
      setError(error_msg)
      setInfo(error_msg);
    }
  };

  let handleSubmit;
  if (categoryFormPurpose === 'createCategory') handleSubmit = handleCreateCategory;
  if (categoryFormPurpose === 'updateCategory') handleSubmit = handleUpdateCategory;

  return (
    <div
      className="absolute w-full h-full flex flex-col justify-center items-center z-10"
      style={{
        backgroundColor: 'rgba(255,255,255,.95)',
      }}
    >
    
      <div className="bg-gray-100 w-96 py-8 shadow-lg rounded-lg px-10">
        <form onSubmit={handleSubmit}>

          <div>
            {message ? (
              <div className="mt-6">
                <p className="text-sm text-blue-500 -bottom-6">{message}</p>
                <br/>
              </div>
              ): <></>}
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-5 text-gray-700"
            >
              Name
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="name"
                  type="name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  defaultValue={category ? category.name : ''}
                />
              </div>
            </label>
          </div>
          {error ? (
          <div className="mt-6">
            <p className="text-sm text-red-500 -bottom-6">{error}</p>
          </div>
          ): <></>}
          <div className="mt-10">
            <span className="block w-full rounded-md shadow-sm flex space-x-4">
              {
                category && category.id != null ? (
                  <button
                    type="submit"
                    className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                    onClick={() => {setCategoryFormPurpose("updateCategory"); setInfo(null)}}
                  >
                    Update category
                  </button>
                ):(
                  <button
                    type="submit"
                    className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                    onClick={() => {setCategoryFormPurpose("createCategory"); setInfo(null)}}
                  >
                    Create category
                  </button>
                )
              }
              <button
                type="submit"
                className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                onClick={() => setCategoryFormPurpose(undefined)}
              >
                Cancel
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
