<?php

/**
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @version $Id$
 * 
 */

//class Zend_View_Helper_Grid extends Zend_View_Helper_Abstract
class Zend_View_Helper_Grid
{

	public $view;

	public function setView(Zend_View_Interface $view)
	{
		$this->view = $view;
		return $this;
	}

//	public function grid($name, $fields = array(), $paginator = null, $sorting = false, $baseUrl = null, $edit = array(), $delete = array())
	public function grid(Model_Grid $grid)
	{

		if ($grid->getEdit()) {
			$edit = $grid->getEdit();
			$editModule = $edit['module'];
			$editAction = $edit['action'];
			$this->view->headScript()->prependScript("var editUrl = '/$editModule/$editAction';");
		}
		
		// Add default script for grid
		$this->view->headScript()->appendFile($grid->getBaseUrl() . '/scripts/grid.js');

		// talking value of sort using Front controller getRequest() method.
		$_sort = Zend_Controller_Front::getInstance()->getRequest()->getParam('sort', 'asc');
		$_by = Zend_Controller_Front::getInstance()->getRequest()->getParam('by', 'id');
		$_colSpan = (count($grid->getFields())*3);
		
		// start constructing the grid.
		$output  = '<div id="grid">'."\n";
		$output .= '
<table id="null" border="0" width="800" cellpadding="5" style="border:0px; background-color: #fff;">

	<tr>
	  <td align="left" width="780"><h3>'.$grid->getName().'</h3></td>
	  <td align="right" width="10" colspan="1">';
		if ($grid->getAdd()) {
			$add = $grid->getAdd();
			$addModule = $add['module'];
			$addAction = $add['action'];
			$output .= '<a id="add" href="'.$grid->getBaseUrl().'/'.$addModule.'/'.$addAction.'"><img src="'.$grid->getBaseUrl().'/images/button/add.gif" alt="" height="32" width="66"/></a>'."\n";
		}
$output .= '</td>
	</tr>

  <tr>
	<td align="center" colspan="3">
	  <table border="0" align="center" cellpadding="0" cellspacing="0" style="border-right: 1px solid #CCCCCC; border-left: 1px solid #919191;" bgcolor="#F7F6F1">

<!-- START OF TABLE HEAD -->
	  <tr class="head">
'."\n"
		;

		for($i=0; $i < count($grid->getFields()); $i++ )
		{
			$__fields = $grid->getFields();
			$__fields = $__fields[$i];
			$arrow = $grid->getBaseUrl(). '/images/grid/';
			if ($grid->getSorting()) {
				if ($_by == $__fields->getColum() && $_sort == 'asc') {
					$title = "<a href=\"".$this->view->url(array('sort'=>'desc', 'by'=>$__fields->getColum()))."\">".$__fields->getTitle()."</a>";
					$arrow .= 'arrow_asc_on.gif';
				} elseif ($_by == $__fields->getColum() && $_sort == 'desc') {
					$title = "<a href=\"".$this->view->url(array('sort'=>'asc', 'by'=>$__fields->getColum()))."\">".$__fields->getTitle()."</a>";
					$arrow .= 'arrow_desc_on.gif';
				} else {
					$title = "<a href=\"".$this->view->url(array('sort'=>'asc', 'by'=>$__fields->getColum()))."\">".$__fields->getTitle()."</a>";
					$arrow .= 'arrow_asc_off.gif';
				}
			} else {
				$title = $__fields[$i]['title'];
			}
			$output .= ' 
		  <td width="20" height="20" style="background: url(\''.$grid->getBaseUrl().'/images/grid/bg_title.gif\');">
			<img src="'.$arrow.'" alt=""/>
		  </td>

		  <td width="'.$__fields->getSize().'" style="background: url(\''.$grid->getBaseUrl().'/images/grid/bg_title.gif\');">
			'.$title.'
		  </td>

		  <td width="0" style="background: url(\''.$grid->getBaseUrl().'/images/grid/bg_title.gif\');">
			<img src="'.$grid->getBaseUrl().'/images/grid/divisor_title.gif" alt=""/>
		  </td>

'."\n";
		}
		if ($grid->getAction()) {
			$output .= '
		  <td align="center" style="background: url(\''.$grid->getBaseUrl().'/images/grid/bg_title.gif\');" width="65" >
			A&ccedil;&otilde;es
		  </td>
';
		}
		$output .= '

		</tr>
<!-- END OF TABLE HEAD -->


		<tr>'."\n";


		for($i=0; $i < count($grid->getFields()); $i++ ) {
			$__fields = $grid->getFields();
			$__fields = $__fields[$i];
			if ($_by == $__fields->getColum()) {
				$output .= '
		  <td height="3" bgcolor="#FF7015"></td>
		  <td bgcolor="#FF7015"></td>
		  <td bgcolor="#FF7015"></td>
				';
			} else {
				$output .= '
		  <td height="3" bgcolor="#BFBDB3"></td>
		  <td bgcolor="#BFBDB3"></td>
		  <td bgcolor="#BFBDB3"></td>
				';
			}
		}
		$output .= '
		</tr>
		';

		if (!$grid->getPaginator()->getTotalItemCount()) {
			$output .= '<tr class="row0">
  <td colspan="'.$_colSpan.'" height="4" align="center">* NENHUM REGISTRO ENCONTRADO *</td>
</tr>';
		}
		$i=0;
		foreach ($grid->getPaginator() as $post)
		{
			$i++;
			$class = 'row' . ($i%2);
			$output .= '
<tr class="content">
  <td height="3" colspan="'.$_colSpan.'"></td>
</tr>
<tr class="'.$class.'" id="id'.$post['id'].'">
';
			for ($x = 0; $x < count($grid->getFields()); $x++)
			{
				$_colum = $grid->getFields();
				$_colum = $_colum[$x]->getColum();
				$output .= '
  <td align="center">
	</td>
	';
				if ($x != count($grid->getFields())-1) { 
					$output .='
  <td
	>'.utf8_decode($post[$_colum]).'</td>
  <td style="background: url(\''.$grid->getBaseUrl().'/images/grid/divisor_content.gif\');"></td>
';
				} else {
					$output .='
  <td colspan="2">'.utf8_decode($post[$_colum]).'</td>
';
				}
			}
			if ($grid->getAction()) {
			$output .= '

  <td align="center">';

			if ($grid->getEdit()) {
				$edit = $grid->getEdit();
				$editModule = $edit['module'];
				$editAction = $edit['action'];
				$output .= '<a href="'.$grid->getBaseUrl().'/'.$editModule.'/'.$editAction.'/id/'.$post['id'].'"><img src="'.$grid->getBaseUrl().'/images/edit.png" alt=""/></a>'."\n";
			}

			if ($grid->getGenealogia()) {
				$genealogia = $grid->getGenealogia();
				$genealogiaModule = $genealogia['module'];
				$genealogiaAction = $genealogia['action'];
				$output .= '<a href="'.$grid->getBaseUrl().'/'.$genealogiaModule.'/'.$genealogiaAction.'/id/'.$post['id'].'"><img src="'.$grid->getBaseUrl().'/images/genealogia_small.gif" alt=""/></a>'."\n";
			}

			if ($grid->getDelete()) {
				$delete = $grid->getDelete();
				$deleteModule = $delete['module'];
				$deleteAction = $delete['action'];
				$output .= '<a href="#" onclick="check_delete('.$post['id'].', \''.$deleteModule.'\',\''.$grid->getBaseUrl().'/'.$deleteModule.'/'.$deleteAction.'\');"><img src="'.$grid->getBaseUrl().'/images/trash.png" alt=""/></a>'."\n";
			}

			$output .= '
  </td>
';
			}
			$output .= '</tr>
			';



			if ($grid->getPaginator()->getCurrentItemCount() != $i) {
				$output .= '
<tr class="content">
  <td height="3" colspan="'.$_colSpan.'"></td>
</tr>

<tr>
  <td height="1" colspan="'.$_colSpan.'" bgcolor="#BFBDB3"></td>
</tr>
';
			}
		}


		$output .= '
<tr class="content">
  <td colspan="'.$_colSpan.'" height="4"></td>
</tr>

<tr>
  <td height="10" style="background: url(\''.$grid->getBaseUrl().'/images/grid/bg_bottom.gif\');" colspan="'.$_colSpan.'"></td>
</tr>

</table>
</td>
  </tr>
<tr><td colspan="3" align="center">

<div class="pagination">
' . $this->view->paginationControl(
	$grid->getPaginator(),
	'Sliding',
	'/pagination_control.phtml'
);
		$output .= '</div>
</td></tr>
</table>
</div>
<script type="text/javascript">
function highligth(cell, className) {
	cell.parentNode.className = className;
}
</script>
';

		return $output;
	}



}