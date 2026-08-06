'use client';

import React, { useState, useEffect } from 'react';

interface FeedItem {
  id: string;
  name: string;
  category: string;
  unitType: string;
  quantity: number;
  unitWeight: number;
  stock: number;
  pricePerKg: number;
  lastDate: string;
}

interface RecipeIngredient {
  name: string;
  weight: number; // 투입 중량 (kg)
  pricePerKg: number; // kg당 단가
}

interface TmrRecipe {
  id: string;
  title: string;
  target: string;
  totalWeight: number; // 총 중량 (kg)
  pricePerKg: number;  // 자동 계산된 kg당 단가
  status: '사용중' | '검토중';
  ingredients: RecipeIngredient[];
}

interface TmrProduction {
  id: string;
  date: string;
  recipeTitle: string;
  productionAmount: number;
  worker: string;
}

export default function TmrPage() {
  const [recipes, setRecipes] = useState<TmrRecipe[]>([]);
  const [productions, setProductions] = useState<TmrProduction[]>([]);
  const [availableFeeds, setAvailableFeeds] = useState<FeedItem[]>([]);

  // 모달 상태
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);

  // 배합비 폼 상태
  const [recipeForm, setRecipeForm] = useState({
    title: '',
    target: '',
    status: '사용중' as '사용중' | '검토중',
  });

  // 배합비 작성 시 선택한 원료 리스트 (원료명, 투입량kg)
  const [selectedIngredients, setSelectedIngredients] = useState<{ name: string; weight: string }[]>([
    { name: '', weight: '' }
  ]);

  // 생산 내역 폼 상태
  const [prodForm, setProdForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    recipeTitle: '',
    productionAmount: '1.2',
    worker: '관리자',
  });

  useEffect(() => {
    // 1. 사료/재고 데이터 불러오기
    const savedFeeds = localStorage.getItem('feedRecordsMultiUnitCustom');
    if (savedFeeds) {
      try {
        setAvailableFeeds(JSON.parse(savedFeeds));
      } catch (e) {
        setAvailableFeeds([]);
      }
    }

    // 2. TMR 배합비 및 생산내역 불러오기
    const savedRecipes = localStorage.getItem('tmrRecipesAutoCustom');
    const savedProds = localStorage.getItem('tmrProductionsAutoCustom');

    if (savedRecipes) {
      try { setRecipes(JSON.parse(savedRecipes)); } catch (e) { initDefaultData(); }
    } else {
      initDefaultData();
    }

    if (savedProds) {
      try { setProductions(JSON.parse(savedProds)); } catch (e) { initDefaultProds(); }
    } else {
      initDefaultProds();
    }
  }, []);

  const initDefaultData = () => {
    const defaultRecipes: TmrRecipe[] = [
      {
        id: '1',
        title: '비육우 후기 배합비',
        target: '비육우 (12개월령 이상)',
        totalWeight: 250,
        pricePerKg: 342,
        status: '사용중',
        ingredients: [
          { name: '볏짚', weight: 100, pricePerKg: 200 },
          { name: '황우2호', weight: 75, pricePerKg: 620 },
          { name: '비지', weight: 75, pricePerKg: 165 },
        ],
      },
    ];
    setRecipes(defaultRecipes);
    localStorage.setItem('tmrRecipesAutoCustom', JSON.stringify(defaultRecipes));
  };

  const initDefaultProds = () => {
    const defaultProds: TmrProduction[] = [
      { id: '1', date: '2026-07-22 08:30', recipeTitle: '비육우 후기 배합비', productionAmount: 1.2, worker: '관리자' },
    ];
    setProductions(defaultProds);
    localStorage.setItem('tmrProductionsAutoCustom', JSON.stringify(defaultProds));
  };

  const saveRecipes = (newRecipes: TmrRecipe[]) => {
    setRecipes(newRecipes);
    localStorage.setItem('tmrRecipesAutoCustom', JSON.stringify(newRecipes));
  };

  const saveProductions = (newProds: TmrProduction[]) => {
    setProductions(newProds);
    localStorage.setItem('tmrProductionsAutoCustom', JSON.stringify(newProds));
  };

  // 원료 행 추가/삭제
  const addIngredientRow = () => {
    setSelectedIngredients([...selectedIngredients, { name: '', weight: '' }]);
  };

  const removeIngredientRow = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: 'name' | 'weight', value: string) => {
    const newItems = [...selectedIngredients];
    newItems[index][field] = value;
    setSelectedIngredients(newItems);
  };

  // 배합비 등록 및 수정 저장
  const handleRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeForm.title || !recipeForm.target) {
      alert('배합비 명칭과 적용 대상을 입력해주세요.');
      return;
    }

    let totalW = 0;
    let totalPriceSum = 0;

    const formattedIngredients: RecipeIngredient[] = selectedIngredients.map(item => {
      const weightNum = Number(item.weight) || 0;
      const matchedFeed = availableFeeds.find(f => f.name === item.name);
      const priceKg = matchedFeed ? matchedFeed.pricePerKg : 300;

      totalW += weightNum;
      totalPriceSum += weightNum * priceKg;

      return {
        name: item.name || '미선택 원료',
        weight: weightNum,
        pricePerKg: priceKg,
      };
    });

    if (totalW <= 0) {
      alert('원료 투입량을 올바르게 입력해주세요.');
      return;
    }

    const calculatedPricePerKg = Math.round(totalPriceSum / totalW);

    if (editingRecipeId) {
      const updated = recipes.map(r => r.id === editingRecipeId ? {
        ...r,
        title: recipeForm.title,
        target: recipeForm.target,
        totalWeight: totalW,
        pricePerKg: calculatedPricePerKg,
        status: recipeForm.status,
        ingredients: formattedIngredients,
      } : r);
      saveRecipes(updated);
      alert('배합비가 수정되었습니다!');
    } else {
      const newRecipe: TmrRecipe = {
        id: Date.now().toString(),
        title: recipeForm.title,
        target: recipeForm.target,
        totalWeight: totalW,
        pricePerKg: calculatedPricePerKg,
        status: recipeForm.status,
        ingredients: formattedIngredients,
      };
      saveRecipes([newRecipe, ...recipes]);
      alert('새 배합비가 작성되었습니다!');
    }

    setIsRecipeModalOpen(false);
    setEditingRecipeId(null);
  };

  const openAddRecipeModal = () => {
    setEditingRecipeId(null);
    setRecipeForm({ title: '', target: '', status: '사용중' });
    setSelectedIngredients([{ name: availableFeeds[0]?.name || '', weight: '100' }]);
    setIsRecipeModalOpen(true);
  };

  const openEditRecipeModal = (recipe: TmrRecipe) => {
    setEditingRecipeId(recipe.id);
    setRecipeForm({
      title: recipe.title,
      target: recipe.target,
      status: recipe.status,
    });
    setSelectedIngredients(recipe.ingredients.map(i => ({ name: i.name, weight: i.weight.toString() })));
    setIsRecipeModalOpen(true);
  };

  const handleDeleteRecipe = (id: string, title: string) => {
    if (confirm(`[${title}] 배합비를 삭제하시겠습니까?`)) {
      saveRecipes(recipes.filter(r => r.id !== id));
    }
  };

  // 생산 내역 등록/수정 처리
  const handleProdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.recipeTitle || !prodForm.productionAmount) {
      alert('배합비와 생산량을 입력해주세요.');
      return;
    }

    const formattedDate = prodForm.date.replace('T', ' ');
    const amountNum = Number(prodForm.productionAmount);

    if (editingProdId) {
      const updated = productions.map(p => p.id === editingProdId ? {
        ...p,
        date: formattedDate,
        recipeTitle: prodForm.recipeTitle,
        productionAmount: amountNum,
        worker: prodForm.worker,
      } : p);
      saveProductions(updated);
      alert('생산 내역이 수정되었습니다!');
    } else {
      const newProd: TmrProduction = {
        id: Date.now().toString(),
        date: formattedDate,
        recipeTitle: prodForm.recipeTitle,
        productionAmount: amountNum,
        worker: prodForm.worker,
      };
      saveProductions([newProd, ...productions]);
      alert('생산 내역이 기록되었습니다!');
    }

    setIsProdModalOpen(false);
    setEditingProdId(null);
  };

  const openAddProdModal = () => {
    setEditingProdId(null);
    setProdForm({
      date: new Date().toISOString().slice(0, 16),
      recipeTitle: recipes[0]?.title || '',
      productionAmount: '1.0',
      worker: '관리자',
    });
    setIsProdModalOpen(true);
  };

  const openEditProdModal = (prod: TmrProduction) => {
    setEditingProdId(prod.id);
    setProdForm({
      date: prod.date.replace(' ', 'T'),
      recipeTitle: prod.recipeTitle,
      productionAmount: prod.productionAmount.toString(),
      worker: prod.worker,
    });
    setIsProdModalOpen(true);
  };

  const handleDeleteProd = (id: string) => {
    if (confirm('해당 생산 내역을 삭제하시겠습니까?')) {
      saveProductions(productions.filter(p => p.id !== id));
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-extrabold text-gray-900">🚜 TMR 사료 배합 및 생산 관리</h2>
        <div className="flex gap-2">
          <button 
            onClick={openAddProdModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
          >
            + 생산 내역 기록
          </button>
          <button 
            onClick={openAddRecipeModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm"
          >
            + 새 배합비 작성
          </button>
        </div>
      </div>

      {/* 배합비 카드 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">{recipe.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">적용 대상: {recipe.target} | 총중량: {recipe.totalWeight}kg | 단가: <strong className="text-blue-600">{recipe.pricePerKg}원/kg</strong></p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${recipe.status === '사용중' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {recipe.status}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-600 mb-1">원료 배합 비율 및 투입량 자동 구성</div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex mb-2">
                  {recipe.ingredients.map((ing, i) => {
                    const percent = recipe.totalWeight > 0 ? (ing.weight / recipe.totalWeight) * 100 : 0;
                    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'];
                    return <div key={i} style={{ width: `${percent}%` }} className={`h-full ${colors[i % colors.length]}`} title={`${ing.name} ${percent.toFixed(1)}%`} />;
                  })}
                </div>
                <div className="flex flex-col gap-1 text-xs text-gray-600 mt-2">
                  {recipe.ingredients.map((ing, i) => {
                    const percent = recipe.totalWeight > 0 ? ((ing.weight / recipe.totalWeight) * 100).toFixed(1) : 0;
                    return (
                      <div key={i} className="flex justify-between bg-gray-50 px-2 py-1 rounded">
                        <span className="font-bold text-gray-800">· {ing.name}</span>
                        <span className="text-gray-500">{ing.weight} kg (<strong className="text-emerald-600">{percent}%</strong> / 단가 {ing.pricePerKg}원)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t text-xs">
              <button onClick={() => openEditRecipeModal(recipe)} className="text-blue-600 hover:text-blue-800 font-bold">수정</button>
              <button onClick={() => handleDeleteRecipe(recipe.id, recipe.title)} className="text-red-500 hover:text-red-700 font-bold">삭제</button>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 TMR 생산 내역 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">최근 TMR 생산 내역</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                <th className="px-4 py-3 font-semibold">생산 일시</th>
                <th className="px-4 py-3 font-semibold">사용한 배합비 명칭</th>
                <th className="px-4 py-3 font-semibold">생산량</th>
                <th className="px-4 py-3 font-semibold">작업자</th>
                <th className="px-4 py-3 font-semibold text-right w-28">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {productions.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/30">
                  <td className="px-4 py-3 text-xs text-gray-600">{prod.date}</td>
                  <td className="px-4 py-3 text-xs font-bold text-gray-900">{prod.recipeTitle}</td>
                  <td className="px-4 py-3 text-xs font-extrabold text-blue-600">{prod.productionAmount} 톤</td>
                  <td className="px-4 py-3 text-xs text-gray-800">{prod.worker}</td>
                  <td className="px-4 py-3 text-right space-x-2 text-xs">
                    <button onClick={() => openEditProdModal(prod)} className="text-blue-600 hover:text-blue-800 font-bold">수정</button>
                    <button onClick={() => handleDeleteProd(prod.id)} className="text-red-500 hover:text-red-700 font-bold">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 배합비 작성/수정 모달 */}
      {isRecipeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">{editingRecipeId ? '✏️ 배합비 수정' : '🌾 새 배합비 작성 (재고 연동)'}</h3>
              <button onClick={() => setIsRecipeModalOpen(false)} className="text-gray-400 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleRecipeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">배합비 명칭</label>
                <input 
                  type="text" 
                  placeholder="예: 비육우 전기 배합비" 
                  value={recipeForm.title}
                  onChange={(e) => setRecipeForm({...recipeForm, title: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">적용 대상</label>
                <input 
                  type="text" 
                  placeholder="예: 비육우 (8~12개월령)" 
                  value={recipeForm.target}
                  onChange={(e) => setRecipeForm({...recipeForm, target: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">상태</label>
                <select 
                  value={recipeForm.status}
                  onChange={(e) => setRecipeForm({...recipeForm, status: e.target.value as '사용중' | '검토중'})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                >
                  <option value="사용중">사용중</option>
                  <option value="검토중">검토중</option>
                </select>
              </div>

              {/* 원료 선택 및 중량 입력 섹션 */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-gray-700">배합 원료 및 투입량 설정</label>
                  <button type="button" onClick={addIngredientRow} className="text-blue-600 font-bold text-xs">+ 원료 추가</button>
                </div>

                {selectedIngredients.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select 
                      value={item.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="flex-1 p-2 bg-gray-50 border rounded-xl font-bold text-emerald-700"
                    >
                      <option value="">-- 재고 원료 선택 --</option>
                      {availableFeeds.map(feed => (
                        <option key={feed.id} value={feed.name}>{feed.name} (단가: {feed.pricePerKg}원/kg)</option>
                      ))}
                    </select>

                    <input 
                      type="number" 
                      placeholder="투입량(kg)" 
                      value={item.weight}
                      onChange={(e) => handleIngredientChange(index, 'weight', e.target.value)}
                      className="w-24 p-2 bg-gray-50 border rounded-xl font-bold"
                    />
                    <span className="text-gray-500 font-semibold">kg</span>

                    {selectedIngredients.length > 1 && (
                      <button type="button" onClick={() => removeIngredientRow(index)} className="text-red-500 font-bold px-2">×</button>
                    )}
                  </div>
                ))}
                <p className="text-[11px] text-blue-600 font-medium">💡 원료를 선택하고 투입할 무게(kg)를 적어주시면 비율(%)과 총 단가가 자동으로 계산됩니다.</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsRecipeModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold">취소</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 생산 내역 기록/수정 모달 */}
      {isProdModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">{editingProdId ? '✏️ 생산 내역 수정' : '📦 생산 내역 기록'}</h3>
              <button onClick={() => setIsProdModalOpen(false)} className="text-gray-400 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleProdSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">생산 일시</label>
                <input 
                  type="datetime-local" 
                  value={prodForm.date}
                  onChange={(e) => setProdForm({...prodForm, date: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">사용한 배합비</label>
                <select 
                  value={prodForm.recipeTitle}
                  onChange={(e) => setProdForm({...prodForm, recipeTitle: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold text-blue-600"
                >
                  {recipes.map(r => (
                    <option key={r.id} value={r.title}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">생산량 (톤)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={prodForm.productionAmount}
                  onChange={(e) => setProdForm({...prodForm, productionAmount: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">작업자</label>
                <input 
                  type="text" 
                  value={prodForm.worker}
                  onChange={(e) => setProdForm({...prodForm, worker: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsProdModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold">취소</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}