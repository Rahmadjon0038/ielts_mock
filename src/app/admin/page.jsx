'use client'
import BannerComponent from '@/components/banner/Banner'
import { GlobalContainer } from '@/globalStyle'
import React, { useState } from 'react'
import { CardItem, CardList, CardTitle, Container, ViewButton } from './style'
import Link from 'next/link'
import DeleteMock from '@/components/admin/CreateMockModal/DleteMock'
import CreateMockModal from '@/components/admin/CreateMockModal/CreateMockModal'
import { useaddMonth, usedeleteMonth, usegetMonth } from '@/hooks/mockMonth'
import Loader from '@/components/loader/Loader'
function Adminpage() {
  const { data, isLoading, error, refetch } = usegetMonth();
  const addMonthMuation = useaddMonth();
  const deleteMonthMuation = usedeleteMonth();
  const addMock = (date) => {
    addMonthMuation.mutate({ month: date })
  }

  const handledelete = (id) => {
    deleteMonthMuation.mutate(id)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <GlobalContainer>
        <BannerComponent info={'Siz bu yerda angi mocklar yaratishingiz va natijalarni tekshirib borishingiz mumkin'} />
        <Container>
          <h2>Oylik Mock Testlar <CreateMockModal addMock={addMock} /></h2>
          <CardList>
            {data?.map((item) => (
              <CardItem key={item.id}>
                <CardTitle>{item.month}</CardTitle>
                <div className="btnbox">
                  <Link className='link' href={`/admin/mock/${item?.id}`}><ViewButton>View</ViewButton> </Link>
                  <DeleteMock handledelete={handledelete} id={item.id} info={`Diqqat qiling agar mockni o'chirib tashlasangiz malumotarni qayat tiklab bo'lmaydi`} />
                </div>
              </CardItem>
            ))}
          </CardList>
        </Container>
      </GlobalContainer>
    </>
  )
}

export default Adminpage