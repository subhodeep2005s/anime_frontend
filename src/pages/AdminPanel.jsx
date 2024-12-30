

import React, { useState, useEffect } from 'react';
import { 
  ChartPieIcon, 
  FilmIcon, 
  CalendarIcon, 
  UserIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import Select from 'react-select';

const genreOptions = [
  { value: 'Action', label: 'Action' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Music', label: 'Music' },
  { value: 'Romance', label: 'Romance' },
  { value: 'Sci-Fi', label: 'Sci-Fi' },
  { value: 'Seinen', label: 'Seinen' },
  { value: 'Shojo', label: 'Shojo' },
  { value: 'Shonen', label: 'Shonen' },
  { value: 'Slice of life', label: 'Slice of life' },
  { value: 'Supernatural', label: 'Supernatural' },
  { value: 'Time Travel', label: 'Time Travel' },
];

function AdminPage() {
  const [animes, setAnimes] = useState([]);
  const [stats, setStats] = useState({
    totalAnimes: 0,
    ongoingAnimes: 0,
    completedAnimes: 0,
    upcomingAnimes: 0,
    totalEpisodes: 0
  });
  const [newAnime, setNewAnime] = useState({
    id: '',
    title: '',
    image: '',
    description: '',
    type: 'Series',
    episodes: [],
    genre: [],
    rating: '',
    year: '',
    status: ''
  });
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [editingAnimeId, setEditingAnimeId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState(null);

  useEffect(() => {
    fetchAnimes();
  }, []);

  const fetchAnimes = async (genre = '') => {
    const response = await axios.get(`https://anime-backend-dz2k.onrender.com/api/anime${genre ? `?genre=${genre}` : ''}`);
    setAnimes(response.data);
    updateStats(response.data);
  };

  const updateStats = (data) => {
    const totalAnimes = data.length;
    const ongoingAnimes = data.filter(anime => anime.status === 'Ongoing').length;
    const completedAnimes = data.filter(anime => anime.status === 'Completed').length;
    const upcomingAnimes = data.filter(anime => anime.status === 'Upcoming').length;
    const totalEpisodes = data.reduce((sum, anime) => sum + (anime.episodes ? anime.episodes.length : 0), 0);
    setStats({ totalAnimes, ongoingAnimes, completedAnimes, upcomingAnimes, totalEpisodes });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnime(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEpisodeInputChange = (index, e) => {
    const { name, value } = e.target;
    setNewAnime(prev => {
      const updatedEpisodes = [...prev.episodes];
      updatedEpisodes[index] = { ...updatedEpisodes[index], [name]: value };
      return { ...prev, episodes: updatedEpisodes };
    });
  };

  const handleGenreChange = (selectedOptions) => {
    setNewAnime(prev => ({
      ...prev,
      genre: selectedOptions.map(option => option.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAnimeId) {
      await axios.patch(`https://anime-backend-dz2k.onrender.com/api/anime/${editingAnimeId}`, newAnime);
      setEditingAnimeId(null);
    } else {
      await axios.post('https://anime-backend-dz2k.onrender.com/api/anime', newAnime);
    }
    setNewAnime({
      id: '',
      title: '',
      image: '',
      description: '',
      type: 'Series',
      episodes: [],
      genre: [],
      rating: '',
      year: '',
      status: ''
    });
    fetchAnimes();
  };

  const handleAddEpisode = () => {
    setNewAnime(prev => ({
      ...prev,
      episodes: [...prev.episodes, { title: '', number: '', description: '', downloadLink: '' }]
    }));
  };

  const handleDeleteConfirmation = (anime) => {
    setAnimeToDelete(anime);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    if (animeToDelete) {
      await axios.delete(`https://anime-backend-dz2k.onrender.com/api/anime/${animeToDelete.id}`);
      setShowDeleteConfirmation(false);
      setAnimeToDelete(null);
      fetchAnimes();
    }
  };

  const handleEdit = (anime) => {
    setNewAnime(anime);
    setEditingAnimeId(anime.id);
  };

  const handleGenreFilter = (selectedOption) => {
    setSelectedGenre(selectedOption);
    fetchAnimes(selectedOption ? selectedOption.value : '');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard icon={ChartPieIcon} title="Total Animes" value={stats.totalAnimes} />
            <StatsCard icon={FilmIcon} title="Ongoing Animes" value={stats.ongoingAnimes} />
            <StatsCard icon={FilmIcon} title="Completed Animes" value={stats.completedAnimes} />
            <StatsCard icon={CalendarIcon} title="Upcoming Animes" value={stats.upcomingAnimes} />
            <StatsCard icon={UserIcon} title="Total Episodes" value={stats.totalEpisodes} />
          </div>
        </div>

        {/* Add/Edit Anime Form */}
        <div className="mt-10">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingAnimeId ? 'Edit Anime' : 'Add New Anime'}
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <form onSubmit={handleSubmit} className="space-y-6 sm:px-6 lg:px-8 pb-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <InputField
                    label="ID"
                    name="id"
                    value={newAnime.id}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Title"
                    name="title"
                    value={newAnime.title}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Image URL"
                    name="image"
                    value={newAnime.image}
                    onChange={handleInputChange}
                  />
                  <TextareaField
                    label="Description"
                    name="description"
                    value={newAnime.description}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Year"
                    name="year"
                    value={newAnime.year}
                    onChange={handleInputChange}
                  />
                  <SelectField
                    label="Status"
                    name="status"
                    value={newAnime.status}
                    onChange={handleInputChange}
                    options={[
                      { value: "Ongoing", label: "Ongoing" },
                      { value: "Completed", label: "Completed" },
                      { value: "Upcoming", label: "Upcoming" }
                    ]}
                  />
                  <SelectField
                    label="Type"
                    name="type"
                    value={newAnime.type}
                    onChange={handleInputChange}
                    options={[
                      { value: "Series", label: "Series" },
                      { value: "Movie", label: "Movie" }
                    ]}
                  />
                  <InputField
                    label="Rating"
                    name="rating"
                    value={newAnime.rating}
                    onChange={handleInputChange}
                  />
                  <div className="sm:col-span-6">
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                      Genre
                    </label>
                    <div className="mt-1">
                      <Select
                        isMulti
                        name="genre"
                        options={genreOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleGenreChange}
                        value={newAnime.genre.map(g => ({ value: g, label: g }))}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: 'white',
                            color: 'black',
                          }),
                          option: (provided) => ({
                            ...provided,
                            color: 'black',
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Episodes Section */}
                {newAnime.type === 'Series' && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Episodes</h4>
                    {newAnime.episodes.map((episode, index) => (
                      <div key={index} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mb-4">
                        <InputField
                          label="Episode Title"
                          name="title"
                          value={episode.title}
                          onChange={(e) => handleEpisodeInputChange(index, e)}
                        />
                        <InputField
                          label="Episode Number"
                          name="number"
                          value={episode.number}
                          onChange={(e) => handleEpisodeInputChange(index, e)}
                        />
                        <TextareaField
                          label="Episode Description"
                          name="description"
                          value={episode.description}
                          onChange={(e) => handleEpisodeInputChange(index, e)}
                        />
                        <InputField
                          label="Download Link"
                          name="downloadLink"
                          value={episode.downloadLink}
                          onChange={(e) => handleEpisodeInputChange(index, e)}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddEpisode}
                      className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Add Episode
                    </button>
                  </div>
                )}

                {newAnime.type === 'Movie' && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Download Link</h4>
                    <InputField
                      label="Download Link"
                      name="downloadLink"
                      value={newAnime.downloadLink}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {editingAnimeId ? 'Update Anime' : 'Add Anime'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Anime List */}
        <div className="mt-10">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Anime List</h3>
              <div className="flex items-center space-x-4">
                <Select
                  isClearable
                  name="genreFilter"
                  options={genreOptions}
                  className="basic-select"
                  classNamePrefix="select"
                  onChange={handleGenreFilter}
                  value={selectedGenre}
                  placeholder="Filter by genre"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: 'white',
                      color: 'black',
                    }),
                    option: (provided) => ({
                      ...provided,
                      color: 'black',
                    }),
                  }}
                />
              </div>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {animes.map((anime) => (
                  <li key={anime.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img className="h-12 w-12 rounded-full" src={anime.image} alt={anime.title} />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{anime.title}</h4>
                          <p className="text-sm text-gray-500">{anime.status} - {anime.year}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {anime.genre.map((g, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(anime)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirmation(anime)}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Anime
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{animeToDelete?.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange }) {
  return (
    <div className="sm:col-span-3">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white text-black"
        />
      </div>
    </div>
  );
}

function TextareaField({ label, name, value, onChange }) {
  return (
    <div className="sm:col-span-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          id={name}
          name={name}
          rows={3}
          value={value}
          onChange={onChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white text-black"
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="sm:col-span-3">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white text-black"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default AdminPage;

