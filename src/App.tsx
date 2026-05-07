/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Trash2, Edit3, Plus, Search, X } from 'lucide-react';

interface House {
  id: string;
  title: string;
  location: string;
}

export default function App() {
  const [houses, setHouses] = useState<House[]>([
    { id: '1', title: 'Cozy Cottage', location: 'Seattle' },
    { id: '2', title: 'Modern Apartment', location: 'New York' },
  ]);
  const [searchInput, setSearchInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentHouse, setCurrentHouse] = useState<House | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // READ - Filter houses based on location
  const filteredHouses = useMemo(() => {
    return houses.filter(h => h.location.toLowerCase().includes(searchInput.toLowerCase()));
  }, [houses, searchInput]);

  // CREATE
  const addHouse = () => {
    if (!newTitle || !newLocation) return;
    const newHouse = {
      id: Math.random().toString(36).substring(7),
      title: newTitle,
      location: newLocation
    };
    setHouses([...houses, newHouse]);
    setNewTitle('');
    setNewLocation('');
  };

  // UPDATE
  const updateHouse = () => {
    if (!currentHouse || !newTitle || !newLocation) return;
    setHouses(houses.map(h => h.id === currentHouse.id ? { ...h, title: newTitle, location: newLocation } : h));
    cancelEdit();
  };

  // DELETE
  const deleteHouse = (id: string) => {
    setHouses(houses.filter(h => h.id !== id));
  };

  const startEdit = (house: House) => {
    setIsEditing(true);
    setCurrentHouse(house);
    setNewTitle(house.title);
    setNewLocation(house.location);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentHouse(null);
    setNewTitle('');
    setNewLocation('');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-500 text-white p-5 text-center">
        <h1 className="text-3xl font-bold">Rent-a-Home</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Search Bar - READ */}
        <section className="flex gap-2 mb-8">
          <input
            type="text"
            id="search-input"
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="Search by location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button 
            id="search-btn"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </section>

        {/* Add/Edit Section - CREATE & UPDATE */}
        <section className="bg-gray-100 p-4 rounded-lg mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Update House' : 'Add New House'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="House Title"
              className="flex-1 p-2 border border-gray-300 rounded"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 p-2 border border-gray-300 rounded"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
            {isEditing ? (
              <div className="flex gap-2">
                <button 
                  onClick={updateHouse}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1"
                >
                  <Edit3 size={16} /> Save
                </button>
                <button 
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-1"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={addHouse}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            )}
          </div>
        </section>

        {/* Featured Houses - READ LISTING */}
        <section className="featured-houses">
          <h2 className="text-2xl font-bold mb-4">Featured Houses</h2>
          <div className="grid gap-4" id="house-list">
            {filteredHouses.length > 0 ? (
              filteredHouses.map((house) => (
                <div 
                  key={house.id}
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm"
                >
                  <div>
                    <h3 className="font-bold text-lg">{house.title}</h3>
                    <p className="text-gray-600 italic">{house.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(house)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button 
                      onClick={() => deleteHouse(house.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">No houses found matching that location.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

