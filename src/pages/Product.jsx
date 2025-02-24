import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductContext } from '../context/productContext'
import Navbar from '../components/layouts/Navbar';
import Sidebar from '../components/layouts/Sidebar';
import ProductModal from '../components/fragments/ModalProduct';
import Pagination from '../components/fragments/Pagination';
import CategoryModal from '../components/fragments/ModalCategory';
import CommonToast from '../components/elements/CommonToast';

function Product() {
    const { products, error, loading, addProduct, addCategory,
        deleteProduct, updateProduct, pagination, getAllProduct } = useContext(ProductContext);

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalCategoryOpen, setModalCategoryOpen] = useState(false);
    
    const [isCommonToastOpen, setIsCommonToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState({ 
        type: 'success', 
        message: '' });
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate()

    const categories = [...new Set(products.map(product => product.jenisProduk?.name).filter(Boolean))];

    const handleAddProduct = () => {
        setSelectedProduct(null)
        setModalOpen(true)
    }

    const handleAddCategory = () => {
        setModalCategoryOpen(true)
    }

    const handleSubmitCategory = async (data) => {
        try {
            await addCategory(data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleEditProduct = (product) => {
        console.log("Editing product: ", product);
        setSelectedProduct(product)
        setModalOpen(true)
    }

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProduct(productId);
            setIsCommonToastOpen(true);
            setToastMessage({
                type: 'success',
                message: 'Produk berhasil dihapus',
            });
        } catch (error) {
            setIsCommonToastOpen(true);
            setToastMessage({
                type: 'error',
                message: error.response?.data?.message || 'Produk tidak dapat dihapus karena sudah tercatat pada transaksi',
            });
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, data)
                navigate('/product')
            } else {
                await addProduct(data)
                console.log(data)
                navigate('/product')
            }
            setModalOpen(false)
            setSelectedProduct(null)
        } catch (error) {
            console.log(error.message)
        }
    }

    const toggleDropdown = (productId) => {
        if (productId === dropdownOpen) {
            setDropdownOpen(null);
        } else {
            setDropdownOpen(productId);
        }

    };

    const toggleFilterDropdown = () => {
        setIsFilterDropdownOpen(prev => !prev);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    
    const clearFilter = () => {
        setSelectedCategories([]);
    };


    const setPage = (page) => {
        getAllProduct(page)
    }

    useEffect(() => {
        let filtered = products || [];

        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.jenisProduk?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.jenisProduk?.name));
        }

        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategories, products]);
    

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // if (loading) {
    //     return <p>Loading...</p>;
    // }

    return (
        <>
            <Navbar />

            <Sidebar />

            <CommonToast
                isOpen={isCommonToastOpen}
                onClose={() => setIsCommonToastOpen(false)}
                message={toastMessage.message}
                type={toastMessage.type}
            ></CommonToast>

            <section className="bg-gray-50 dark:bg-gray-900 h-full p-3 sm:p-5 md:ml-64 pt-20">          
                <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden mt-20">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                            <div className="w-full md:w-1/2">
                                <form className="flex items-center">
                                    <label htmlFor="simple-search" className="sr-only">Search</label>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input 
                                            onChange={handleSearchChange} 
                                            type="text" 
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                                            placeholder="Search" 
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                <button 
                                    onClick={handleAddCategory} 
                                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    <svg className="h-3.5 w-3.5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                    </svg>
                                    Tambah Kategori
                                </button>

                                <button 
                                    onClick={handleAddProduct}
                                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-2 text-gray-400" viewbox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                                        </svg>
                                    Tambah Produk
                                </button>
                                <div className="relative w-full md:w-auto">
                                <button 
                                    onClick={toggleFilterDropdown} 
                                    className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-2 text-gray-400" viewbox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                                    </svg>
                                    Filter Kategori
                                </button>
                                {isFilterDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg dark:bg-gray-800 dark:border-gray-600">
                                        {categories.map(category => (
                                            <label key={category} className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="mr-2"
                                                    checked={selectedCategories.includes(category)}
                                                    onChange={() => handleCategoryFilter(category)}
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                                            </label>
                                        ))}
                                        <button 
                                            onClick={clearFilter} 
                                            className="w-full text-center text-sm font-medium text-red-500 py-2 hover:bg-red-100 dark:hover:bg-red-700"
                                        >
                                            Hapus Filter
                                        </button>
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Nama Produk</th>
                                        <th scope="col" className="px-4 py-3">Kode</th>
                                        <th scope="col" className="px-4 py-3">Kategori</th>
                                        <th scope="col" className="px-4 py-3">Merk</th>
                                        <th scope="col" className="px-4 py-3">Stok</th>
                                        <th scope="col" className="px-4 py-3">Harga Jual</th>
                                        <th scope="col" className="px-4 py-3">Harga Beli</th>
                                        <th scope="col" className="px-4 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {product.nama}
                                            </td>
                                            <td className="px-4 py-3">{product.kode}</td>
                                            <td className="px-4 py-3">{product.jenisProduk ? product.jenisProduk.name : "null"}</td>
                                            <td className="px-4 py-3">{product.merk}</td>
                                            <td className="px-4 py-3">{product.stok}</td>
                                            <td className="px-4 py-3">{product.harga}</td>
                                            <td className="px-4 py-3">{product.hargaBeli}</td>
                                            <td className="px-4 py-3">
                                                <div className="relative flex justify-end">
                                                    <button
                                                        onClick={() => toggleDropdown(product.id)}
                                                        className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                                        type="button"
                                                    >
                                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </button>
                                                    {dropdownOpen === product.id && (
                                                        <div className="absolute right-0 z-50 mt-1 bg-white divide-y divide-gray-100 rounded shadow w-28 top-full dark:bg-gray-700 dark:divide-gray-600">
                                                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                                                <li onClick={() => handleEditProduct(product)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                    Edit
                                                                </li>
                                                                <li onClick={() => handleDeleteProduct(product.id)} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                    Hapus
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination 
                            limit={pagination.limit} 
                            totalPage={pagination.totalPage} 
                            page={pagination.page} 
                            setPage={setPage}
                        />
                    </div>
                </div>
            </section>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setSelectedProduct(null)
                }}
                productData={selectedProduct}
                onSubmit={handleSubmit}
            ></ProductModal>

            <CategoryModal
                isOpen={isModalCategoryOpen}
                onClose={() => {
                    setModalCategoryOpen(false)
                }}
                onSubmit={handleSubmitCategory}
            ></CategoryModal>
        </>
    )
}

export default Product